var Wunderground = require('wundergroundnode');
var Datastore    = require('nedb');
var http         = require("http");
var async        = require("async");
var log4js       = require('log4js');

var logger = log4js.getLogger();
logger.setLevel('INFO'); //In order: ALL, TRACE, DEBUG, INFO, WARN, ERROR, FATAL

var MAX_NON_REPORT_TIME_MINUTES=60;//amount of time that can elapse before we alarm on weather station down
var MAX_NON_REPORT_TIME_SECS = MAX_NON_REPORT_TIME_MINUTES * 60; //amount of time, in seconds, to alarm on weather station down
var MINUTE = 1000 * 60; //useful substitution 
var MINUTES_UNTIL_GET_WEATHER_DATA = 1 * MINUTE; //determines when we request weather data from Wunderground.  Default is 5 * MINUTE

var SHOW_EMITTER_DATA = true; //determines whether emitter data will be shown on server.

var db     = new Datastore( { filename: './wunderground.db', autoload: true });
var wgInfo = new Datastore( { filename: './myWundergroundInfo.db', autoload: true });

var id; //definefd in getData()
var wunderground; //defined in getAppInfo()
var my_key=""; //defined in getAppInfo()
var city="";
var state="";
var zip="";
var station="";
var myPort="";
var myServer="";
var server_time_now=new Date();

var emitter_weather={};
var wunderground_weather={}; //contains weather info returned by Wunderground.com API

function createAppServer(callback) {
    logger.trace("createAppServer() entry");

    http.createServer(function(req, res) {
        var index = "./weatherServer";
        var interval;
        var temp_f = emitter_weather.temp_f;
        var last_time="";
        var weather;

        var time_now_seconds = Math.floor(new Date().getTime()/1000);
        if(time_now_seconds - emitter_weather.observation_epoch >= MAX_NON_REPORT_TIME_SECS ) {
            logger.error("****************WEATHER STATION EXCEEDED NON-REPORTING TIME*****************");
            logger.error("Switch to alternate weather station");
        } else {
            logger.debug("WEATHER STATION OK");
        }
        
        logger.debug("server page requested is " + req.url);
        if(req.url === "/") {
            filename = index; logger.debug("changing requested server page to filename " + filename);
        } else {
            filename = "." + req.url;
            logger.debug("changed requested server page to filename " + filename);
        }

        if(filename === "./weatherServer") {
            logger.trace("filename === '/.weatherServer' is true ");
            res.writeHead(200, {"Content-type":"text/event-stream", "Cache-Control":"no-cache", "Connection":"keep-alive"});
            res.write("retry: 10000\n");
            res.write("event: connectime\n");
            interval = setInterval(function() {
                res.write("data: " + (new Date()) + "\n");
                res.write("data: " + "temp_f: " + temp_f + "\n");
                if(last_time !== emitter_weather.local_epoch) {
                    last_time = emitter_weather.local_epoch;
                    weather = JSON.stringify(emitter_weather);
                    res.write("data: " + weather + "\n\n");
                }
            }, 1000);
            req.connection.addListener("close", function() {
                clearInterval(interval);
            }, false);
        } else {
            logger.warn("Requested server page " + req.url + " not a valid hosted page.");
        }
    }).listen(myPort, myServer);
    logger.info("listening on port " + myPort);
    logger.info("listening on server " + myServer);
    logger.trace("createAppServer() exit");
    if(typeof callback === "function")
        callback();
}
        

//get your stored key you obtained from wunderground.com
//If errors, then be sure you have added your key to file 'create_wundergroundInfo.js'
//then run the js via 'nodejs create_wundergroundInfo.js' to create
//your keyfile ./myWundergroundInfo.db
//
function getAppInfo(callback) {
    logger.trace("getAppInfo() entry");
    wgInfo.find({}, function(err, keyDoc) {
        if(err) {
            logger.error("getAppInfo() exit on error", err);
            return;
        }
        logger.debug("keyDoc: ", keyDoc[0]);
        my_key=keyDoc[0].my_key;
        city=keyDoc[0].city;
        state=keyDoc[0].state;
        zip=keyDoc[0].zip;
        station=keyDoc[0].station;
        myServer=keyDoc[0].myServer;
        myPort=keyDoc[0].myPort;
        logger.debug("Proceeding with key: ", my_key);
        wunderground = new Wunderground(my_key);
        logger.trace("getAppInfo() exit");
        if(typeof callback === "function")
            callback();
    });
}

//gets weather data and stores it
function getWeatherData(callback) {
    logger.trace("getWeatherData() entry");
    wunderground.conditions().forecast().request('pws/q/pws:' + station, processWundergroundData);

    logger.trace("getWeatherData() exit");
    if (typeof callback === "function")
        callback();

}

function processWundergroundData(err, weather) {
    logger.trace("processWundergroundData() entry");
    dbInsertWeatherData(err, weather);
    createEmitterData(err, weather);
    showWundergroundData(err, weather);
    logger.trace("processWundergroundData() exit");
}


//callback for Wunderground API usage.
//param weather will contain results obtained from Wunderground
function dbInsertWeatherData(err, weather) {
    logger.trace("dbInsertWeatherData() entry");
    logger.debug("weather: ", weather);

    db.insert(weather, function(err, doc) {
        if(err) {
            logger.error("dbInsertWeatherData() error: ", err);
            return;
        } else {

            id=doc._id;
            logger.debug("db insert record ID: " + id);

            obs=weather.current_observation;

      
            local_epoch_val = parseInt(obs.local_epoch);
            db.update({ _id: id }, { $set: { 'local_epoch_val': local_epoch_val } });
        }
    });
    logger.trace("dbInsertWeatherData() exit");
}

function createEmitterData(err, weather) {
    if(err) {
        logger.error("createEmitterData() err: ", err) 
        return;
    } else {
        logger.trace("createEmitterData() entry");
        obs=weather.current_observation;
       
        server_time_now     = new Date();
        
        emitter_weather = { 'observation_epoch': obs.observation_epoch, 'observation_time': obs.observation_time, 'temp_f': obs.temp_f, 'local_time': obs.local_time_rfc822, 'local_epoch': obs.local_epoch, 
            'wind_mph': obs.wind_mph, 'wind_gust_mph': obs.wind_gust_mph, 'wind_string': obs.wind_string, 'wind_dir': obs.wind_dir, 'wind_degrees': obs.wind_degrees,
            'relative_humidity': obs.relative_humidity, 'pressure_mb': obs.pressure_mb, 'pressure_in': obs.pressure_in, 'pressure_trend': obs.pressure_trend,
            'dewpoint_f': obs.dewpoint_f, 'feelslike_f': obs.feelslike_f, 'visibility_mi': obs.visibility_mi, 'precip_1hr_in': obs.precip_1hr_in, 'precip_today_in': obs.precip_today_in, 'icon': obs.icon,
            'city': city, 'state': state, 'zip': zip, 'station': station, 'server_time': server_time_now 
        }

        logger.debug("createEmitterData(); emitter_weather: ", emitter_weather);
    }
    logger.trace("createEmitterData() exit");
}

function showWundergroundData(err, weather) {
    if(SHOW_EMITTER_DATA) {
        logger.trace("showWundergroundData() entry");
        var forecastday = weather.forecast.simpleforecast.forecastday;
        if(logger.level.isLessThanOrEqualTo("DEBUG")) {
            logger.debug("===========weather forecast start============ ");

            forecastday.forEach(function(forecast) {
                logger.debug(forecast);
            });
            logger.debug("===========weather forecast end============ ");
            logger.debug();
        }

        obs=weather.current_observation;

        console.log("===================== Info ============================================");
        console.log("Wunderground local_time: ", obs.local_time_rfc822);
        console.log("Server time: ", server_time_now);
        console.log("Station ", obs.observation_time);
        console.log("Station: ", station);
        console.log("City: ", obs.observation_location.city);
        console.log("State: ", obs.observation_location.state);
        console.log("Zip: ", obs.display_location.zip);
        console.log("Latitude: ", obs.observation_location.latitude);
        console.log("Longitude: ", obs.observation_location.longitude);
        console.log("Station Elevation: ", obs.observation_location.elevation);
        console.log();
        console.log("===================== CURRENT WEATHER =================================");
        console.log("temp_f: ", obs.temp_f);
        console.log("wind: ", obs.wind_string);
        console.log("icon: ", obs.icon);
        console.log();
        console.log("===================== FORECAST WEATHER ================================");
        forecastday.forEach(function(forecast) {
           console.log("Day: " + forecast.date.weekday );
           console.log("High: " + forecast.high.fahrenheit);
           console.log("Low: " + forecast.low.fahrenheit);
           console.log("Conditions: " + forecast.conditions);
           console.log("Wind Avg: " + forecast.avewind.mph + " Dir: " + forecast.avewind.dir);
           console.log("Wind Max: " + forecast.maxwind.mph + " Dir: " + forecast.maxwind.dir);
           console.log();
        });

        console.log();
        logger.trace("showWundergroundData() exit");
    }
}


async.series([getAppInfo, createAppServer, getWeatherData],function(err) {
    if(err) {
        logger.error("========================async.series error: ", err);
         return;
    }
});

setInterval(getWeatherData, MINUTES_UNTIL_GET_WEATHER_DATA); //schedule next run
