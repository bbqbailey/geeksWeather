var Wunderground = require('wundergroundnode');
var Datastore    = require('nedb');
var http         = require("http");
var async        = require("async");
var log4js       = require('log4js');

var logger = log4js.getLogger();
logger.setLevel('ALL');

var MAX_NON_REPORT_TIME_MINUTES=60;//amount of time that can elapse before we alarm on weather station down
var MAX_NON_REPORT_TIME_SECS = MAX_NON_REPORT_TIME_MINUTES * 60; //amount of time, in seconds, to alarm on weather station down
var MINUTE = 1000 * 60; //useful substitution 
var MINUTES_UNTIL_GET_WEATHER_DATA = 1 * MINUTE; //determines when we request weather data from Wunderground.  Default is 5 * MINUTE

var db     = new Datastore( { filename: './wunderground.db', autoload: true });
var wgInfo = new Datastore( { filename: './myWundergroundInfo.db', autoload: true });

var id; //definefd in getData()
var wunderground; //defined in getWUInfo()
var my_key=""; //defined in getWUInfo()
var city="";
var state="";
var zip="";
var station="";
var myPort="";
var myServer="";
var server_time_now=new Date();

var emitter_weather={};

function createServer(callback) {
    logger.trace("createServer() entry");

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
            filename = index;
            logger.debug("changing requested server page to filename " + filename);
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
    logger.trace("createServer() exit");
    if(typeof callback === "function")
        callback();
}
        

//get your stored key you obtained from wunderground.com
//If errors, then be sure you have added your key to file 'create_wundergroundInfo.js'
//then run the js via 'nodejs create_wundergroundInfo.js' to create
//your keyfile ./myWundergroundInfo.db
//
function getWUInfo(callback) {
    logger.trace("getWUInfo() entry");
    wgInfo.find({}, function(err, keyDoc) {
        if(err) {
            logger.error("getWUInfo() exit on error", err);
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
        logger.trace("getWUInfo() exit");
        if(typeof callback === "function")
            callback();
    });
}



function createEmitterData(err, weather) {
    if(err) {
        logger.error("createEmitterData() err: ", err) 
        return;
    } else {
        logger.trace("createEmitterData() entry");
        obs=weather.current_observation;
        var observation_epoch   = obs.observation_epoch;
        var observation_time    = obs.observation_time; 
        var temp_f              = obs.temp_f;
        var local_time          = obs.local_time_rfc822; 
        var local_epoch         = obs.local_epoch;
        var wind_mph            = obs.wind_mph;
        var wind_gust_mph       = obs.wind_gust_mph;
        var wind_string         = obs.wind_string;
        var wind_dir            = obs.wind_dir;
        var wind_degrees        = obs.wind_degrees;
        var relative_humidity   = obs.relative_humidity; 
        var pressure_mb         = obs.pressure_mb;
        var pressure_in         = obs.pressure_in; 
        var pressure_trend      = obs.pressure_trend; 
        var dewpoint_f          = obs.dewpoint_f;
        var feelslike_f         = obs.feelslike_f;
        var visibility_mi       = obs.visibility_mi;
        var precip_1hr_in       = obs.precip_1hr_in;
        var precip_today_in     = obs.precip_today_in;
        var icon                = obs.icon;
        
        server_time_now     = new Date();
        
        emitter_weather = { 'observation_epoch': observation_epoch, 'observation_time': observation_time, 'temp_f': temp_f, 'local_time': local_time, 'local_epoch': local_epoch, 
            'wind_mph': wind_mph, 'wind_gust_mph': wind_gust_mph, 'wind_string': wind_string, 'wind_dir': wind_dir, 'wind_degrees': wind_degrees,
            'relative_humidity': relative_humidity, 'pressure_mb': pressure_mb, 'pressure_in': pressure_in, 'pressure_trend': pressure_trend,
            'dewpoint_f': dewpoint_f, 'feelslike_f': feelslike_f, 'visibility_mi': visibility_mi, 'precip_1hr_in': precip_1hr_in, 'precip_today_in': precip_today_in, 'icon': icon,
            'city': city, 'state': state, 'zip': zip, 'station': station, 'server_time': server_time_now 
        }

        logger.debug("createEmitterData(); emitter_weather: ", emitter_weather);
    }
    logger.trace("createEmitterData() exit");
}

function dbInsertWeatherData(err, weather) {
    logger.trace("dbInsertWeatherData() entry");
    logger.debug("weather: ", weather);

    createEmitterData(err, weather); //yeah!  asynch
    
    db.insert(weather, function(err, doc) {
        if(err) {
            logger.error("dbInsertWeatherData() error: ", err);
            return;
        } else {

            id=doc._id;

            obs=weather.current_observation;

            logger.info("Wunderground local_time: ", obs.local_time_rfc822);
            logger.info("server time: ", server_time_now);
            logger.info("record id: ", id);
            logger.info("temp_f: ", obs.temp_f);
            logger.info("wind: ", obs.wind_string);
            logger.info("icon: ", obs.icon);
            logger.info();
       
            local_epoch_val = parseInt(obs.local_epoch);
            db.update({ _id: id }, { $set: { 'local_epoch_val': local_epoch_val } });
        }
    });
    logger.trace("dbInsertWeatherData() exit");
}


//gets weather data and stores it
function processWeatherData(callback) {
    logger.trace("processWeatherData() entry");
    wunderground.conditions().request('pws/q/pws:' + station, dbInsertWeatherData);

    logger.trace("processWeatherData() exit");
    if (typeof callback === "function")
        callback();

}


async.series([getWUInfo, createServer, processWeatherData],function(err) {
    logger.error("========================async.series error: ", err);
    return;
});

setInterval(processWeatherData, MINUTES_UNTIL_GET_WEATHER_DATA); //schedule next run
