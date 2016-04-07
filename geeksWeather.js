var express      = require('express');
var path         = require('path');
var bodyParser   = require('body-parser');
var Wunderground = require('wundergroundnode');
var async        = require("async");
var log4js       = require('log4js');
var configFile   = require('./geeksWeatherAppData'); //app json file
var config       = configFile.config;
var key          = require('./wundergroundKey');  //app json file
var theRoutes    = require('./routes/index'); //app js file

var logger = log4js.getLogger();
var app    = module.exports = express();
var mode   = process.env.MODE;
var loggerLevel="";

setMode();

const SECOND = 1000;
const MINUTE = SECOND * 60;
const FORCED_MAX_ELAPSED_TIMEOUT_SEC = 5;;
const FORCED_DEFAULT_DELAY_SECS_FOR_LOOPING_PAGES = 10;
const FORCED_DEFAULT_DELAY_MINUTES_FOR_WUNDERGROUND_REFRESH = 10;
const SEND_TIME = 1 * SECOND; //Send actual time event each second

var MAX_ELAPSED_TIMEOUT_SEC = config.appConfig.MAX_ELAPSED_TIMEOUT_SEC;
if(isNaN(MAX_ELAPSED_TIMEOUT_SEC) || (MAX_ELAPSED_TIMEOUT_SEC < (FORCED_MAX_ELAPSED_TIMEOUT_SEC))) {
  logger.warn("geeksWeather.js: Warning: MAX_ELAPSED_TIMEOUT_SEC is either NaN or is less than " + FORCED_MAX_ELAPSED_TIMEOUT_SEC + " Seconds, so Forcing to " + FORCED_MAX_ELAPSED_TIMEOUT_SEC + ' Seconds.');
  MAX_ELAPSED_TIMEOUT_SEC = FORCED_MAX_ELAPSED_TIMEOUT_SEC;
}
MAX_ELAPSED_TIMEOUT_SEC = MAX_ELAPSED_TIMEOUT_SEC * SECOND;
logger.trace("geeksWeather.js: After assignment, MAX_ELAPSED_TIMEOUT_SEC value is: " + MAX_ELAPSED_TIMEOUT_SEC + " (microseconds).");
logger.info("Set MAX_ELAPSED_TIMEOUT_SEC to " + (MAX_ELAPSED_TIMEOUT_SEC / SECOND) + " Seconds." );


var slideShow_DELAY_SEC  = config.appConfig.slideShow_DELAY_SEC;
if(isNaN(slideShow_DELAY_SEC)) {
  logger.warn("geeksWeather.js: Warning: in geeksWeather.js, forced slideShow_DELAY_SEC to " + FORCED_DEFAULT_DELAY_SECS_FOR_LOOPING_PAGES + ". Verify entry in  geeksWeatherConfiguraton.json file in appConfig section.");
  slideShow_DELAY_SEC = FORCED_DEFAULT_DELAY_SECS_FOR_LOOPING_PAGES;
}
slideShow_DELAY_SEC = slideShow_DELAY_SEC * SECOND;
logger.trace("geeksWeather.js: After assignment, slideShow_DELAY_SEC value is: " + slideShow_DELAY_SEC + " (microseconds).");
logger.info("Set slideShow_DELAY_SEC to " + (slideShow_DELAY_SEC / SECOND) + " Seconds.")

var WUNDERGROUND_REFRESH_WEATHER_MINUTES = config.appConfig.WUNDERGROUND_REFRESH_WEATHER_MINUTES;
if(isNaN(WUNDERGROUND_REFRESH_WEATHER_MINUTES) || (WUNDERGROUND_REFRESH_WEATHER_MINUTES < (FORCED_DEFAULT_DELAY_MINUTES_FOR_WUNDERGROUND_REFRESH))) {
  logger.warn("geeksWeather.js: Warning: WUNDERGROUND_REFRESH_WEATHER_MINUTES is either NaN or is less than " + FORCED_DEFAULT_DELAY_MINUTES_FOR_WUNDERGROUND_REFRESH + " Minutes, so Forcing to " + FORCED_DEFAULT_DELAY_MINUTES_FOR_WUNDERGROUND_REFRESH + ' Minutes.');
  WUNDERGROUND_REFRESH_WEATHER_MINUTES = FORCED_DEFAULT_DELAY_MINUTES_FOR_WUNDERGROUND_REFRESH;
}
WUNDERGROUND_REFRESH_WEATHER_MINUTES = WUNDERGROUND_REFRESH_WEATHER_MINUTES * MINUTE;
logger.trace("geeksWeather.js: After assignment, WUNDERGROUND_REFRESH_WEATHER_MINUTES value is: " + WUNDERGROUND_REFRESH_WEATHER_MINUTES + " (microseconds).");
logger.info("Set WUNDERGROUND_REFRESH_WEATHER_MINUTES to " +  (WUNDERGROUND_REFRESH_WEATHER_MINUTES / MINUTE) + " Minutes.")

//app.locals.DELAY = DELAY;  //is this still needed?
logger.info("geeksWeather.js: NODE_ENV is ", process.env.NODE_ENV); //used in systemd/system/geeksWeather.service

var routes = new theRoutes(slideShow_DELAY_SEC, logger);
app.use('/', routes);

var emitter_weather={};
var connections=[];
var wunderground; //defined in getAppInfo()
var obs={} //weather observation
var noClients=true;

app.use(bodyParser.urlencoded({ extended: true}));
//or app.use(bodyParser.json()) if urlencoded is incorrect;

app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.set('views',path.join( __dirname, 'app_server', 'views'));

app.use(express.static(__dirname + '/public'))

app.get('/eventEngine' , function(req, res) {
    logger.trace('geeksWeather.js: app.get(/eventEngine) entry');
    if(connections.length === 0) {
        noClients=true;
    } else {
        noClients=false;
    }
    connections.push(res);
    logger.debug("geeksWeather.js: app.get(/eventEngine) Added a connection; connections.length: " + connections.length);
    res.writeHead(200, { //the following is what makes it a Server Sent Event!
        "Content-type":"text/event-stream",
        "Cache-Control":"no-cache",
        "Connection":"keep-alive"
    });
    if(noClients) {
        logger.trace("geeksWeather.js: app.get(/eventEngine): noClients was previously true so get new data from wunderground.");
        //we haven't been polling wunderground when no clients so get an update!
        logger.trace("geeksWeather.js: app.get(/eventEngine): calling async.series([getWeatherData, sendWeatherEvent])");
        async.series([getWeatherData, sendWeatherEvent], function(err) {
            if(err) {
                logger.error("geeksWeather.js: async.series error in app.get(/eventEngine)");
            }
        });
        noClients=false;
    } else {
        logger.trace("geeksWeather.js: app.get(/eventEngine): noClients is false");
        sendWeatherEvent();
    }

    req.on("close", function() {
        logger.trace("geeksWeather.js: req.on close");
        var toRemove;
        for(var i=0;i<connections.length; i++) {
            if(connections[i] == res) {
                toRemove=i;
                break;
            }
        }
        connections.splice(i,1);
        logger.debug("geeksWeather.js: Removed a connection; connections.length: " + connections.length);
    });
    logger.trace("geeksWeather.js: app.get(/eventEngine) exit");
});


app.listen(8080, function (err) {
    logger.info('geeksWeather.js: Express started on port 8080');
    if(err) {
      console.log("geeksWeather.js: app.listen(localhost, 8080) error: ");
      err();
    }
});

function setMode() {
  logger.trace("geeksWeather.js: setMode(): entry");
  switch(mode) {
      case "PRODUCTION":
        console.log("Mode is PRODUCTION");
        console.log("Setting logging level to INFO");
        loggerLevel="INFO";
        break;
      case "DEVELOPMENT":
        console.log("Mode is DEVELOPMENT");
        console.log("Setting logging level to DEBUG");
        loggerLevel="DEBUG";
        break;
      case "TESTING":
        console.log("Mode is TESTING");
        console.log("Setting logging level to TRACE");
        loggerLevel="TRACE";
        break;
      default:
        console.log("Mode is INVALID! - ABORTING");
        console.log("--Mode must be one of the following states:");
        console.log("\tPRODUCTION");
        console.log("\tDEVELOPMENT");
        console.log("\tTESTING");
        console.log("--Usage on start:");
        console.log("\tMODE=DEVELOPMENT nodejs geeksWeather");
        process.exit();
  }
  logger.setLevel(loggerLevel); //In order: ALL, TRACE, DEBUG, INFO, WARN, ERROR, FATAL
  logger.info("Mode is " + mode + ", loggerLevel is " + loggerLevel);
  logger.trace("geeksWeather.js: setMode(): exit");

}

var wundergroundInterval = setInterval(function() {
    logger.trace("geeksWeather.js: setInterval(getWeatherData()) entry");
    getWeatherData();
    logger.trace("geeksWeather.js: setInterval(getWeatherData()) exit");
}, WUNDERGROUND_REFRESH_WEATHER_MINUTES);

var dateInterval = setInterval(function() {
    logger.trace("geeksWeather.js: setInterval(sendTime()) entry");
    sendTime();
    logger.trace("geeksWeather.js: setInterval(sendTime()) exit");
}, SEND_TIME);


function sendWeatherEvent() {
    logger.trace("geeksWeather.js: sendWeatherEvent() entry");
    //no reason to proceed if no emitter_weather yet
    if(Object.keys(emitter_weather).length === 0) {
        logger.trace("geeksWeather.js: sendWeatherEvent(), emitter_weather.length === 0 so not sending weather event to clients");
        logger.trace("geeksWeather.js: sendWeatherEvent() exit on emitter.length === 0");
    }
    //no reason to proceed if no clients listening
    if(connections.length === 0) {
        logger.trace("geeksWeather.js: sendWeatherEvent(), connections.length === 0 so not sending weather event to 0 clients!");
        logger.trace("geeksWeather.js: sendWeatherEvent() exit on connections.length === 0");
        logger.trace("geeksWeather.js: sendWeatherEvent() exit");
        return;
    }
    var weatherJson = JSON.stringify(emitter_weather);
    sendConnections(weatherJson, 'weather');
    logger.trace("geeksWeather.js: sendWeatherEvent() exit");
}


function sendTime() {
    logger.trace("geeksWeather.js: sendTime() entry");
    if(connections.length === 0) {
        //no reason to do all of this if no clients!
        logger.trace("geeksWeather.js: sendTime() connections.length === 0 so returning with no work.");
        logger.trace("geeksWeather.js: sendTime() exit");
        return;
    }
    var time = new Date();
    var hours = time.getHours();
    var minutes  = time.getMinutes();
    var seconds = time.getSeconds();
    if(hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }

    if(minutes < 10)
        minutes = "0"+ minutes;
    if(seconds < 10)
        seconds = "0" + seconds;

    var time_data = hours + ":" + minutes + ":" + seconds;
    var jsonTimeTemp = {'time': time_data, 'temp_f': obs.temp_f};

    timeTempJson = JSON.stringify(jsonTimeTemp);
    logger.debug("geeksWeather.js: sendTime() timeJson: " , timeTempJson);
    sendConnections(timeTempJson,'time');
    logger.debug("geeksWeather.js: sendTime(): Number of connections: " + connections.length);
    logger.trace("geeksWeather.js: sendTime() exit");
}

function sendConnections(data, event) {
    logger.trace("geeksWeather.js: sendConnections() entry");
    logger.trace("geeksWeather.js: sendConnections() data: ", data);
    logger.debug("geeksWeather.js: sendConnections() event: ", event);
    for(var i=0; i<connections.length; i++ ) {
        connections[i].write('event: ' + event + '\n');
        connections[i].write('data: ' + data + '\n\n');
    }
    logger.trace("geeksWeather.js: sendConnections() exit");
}


//get your stored key you obtained from wunderground.com
//If errors, then be sure you have added your key to file 'create_wundergroundInfo.js'
//then run the js via 'nodejs create_wundergroundInfo.js' to create
//your keyfile ./myWundergroundInfo.db
//
function getAppInfo(callback) {
    logger.trace("geeksWeather.js: getAppInfo() entry");
    my_key=key.my_key;
    logger.debug("my_key: " + my_key);
    city=config.appConfig.city;
    state=config.appConfig.state;
    zip=config.appConfig.zip;
    station=config.appConfig.station;
    myServer=config.appConfig.myServer;
    myPort=config.appConfig.myPort;
    logger.debug("geeksWeather.js: Proceeding with key: ", my_key);
    wunderground = new Wunderground(my_key);
    if(typeof callback === "function")
        callback();
    logger.trace("geeksWeather.js: getAppInfo() exit");
}

//gets weather data and stores it
function getWeatherData(callback) {
    logger.trace("geeksWeather.js: getWeatherData() entry");
    //no reason to proceed if no clients clients
    if(connections.length === 0) {
        logger.trace("geeksWeather.js: getWeatherData(), connections.length === 0");
        logger.trace("geeksWeather.js: getWeatherData() exit on connections.length === 0");
        return;
    }
    logger.info("geeksWeather.js: getWeatherData() Calling wunderground - Note: This uses your key, so wunderground API limits apply.");
    wunderground.astronomy().conditions().forecast().request('pws/q/pws:' + station, processWundergroundData);

    if (typeof callback === "function")
        callback();
    logger.trace("geeksWeather.js: getWeatherData() exit");
}

function processWundergroundData(err, weather) {
    logger.trace("geeksWeather.js: processWundergroundData() entry");
    logger.trace("geeksWeather.js: processWundergroundData(): does     weather.response.error key exist? " + ("error" in weather.response ? "Yes!" : "No"));
    if("error" in weather.response ? true : false) {
      logger.error();
      logger.error("=======================================================");
      logger.error("==============ERROR====================================");
      logger.error("Error: geeksWeather.js: processWundergroundData(): weather.error.type: ", weather.response.error.type)
      logger.error("Error: geeksWeather.js: processWundergroundData(): Returning without sending any weather data to clients.");
      logger.error("==============ERROR====================================");
      logger.error("=======================================================");
      logger.error();
      emitter_weather = {"station":weather.response.error.type};
      logger.trace("geeksWeather.js: processWundergroundData() calling sendWeatherEvent()");
      sendWeatherEvent();
      logger.trace("geeksWeather.js: processWundergroundData() exit");

      return;

    }
    logger.trace("geeksWeather.js: processWundergroundData() Only simpleforecast.forecastday data: ", weather.forecast.simpleforecast.forecastday);
    logger.trace("geeksWeather.js: processWundergroundData() Whole return weather: ", weather);

    logger.trace("geeksWeather.js: processWundergroundData() calling createEmitterData()");
    createEmitterData(err, weather);
    logger.trace("geeksWeather.js: processWundergroundData() exit");
}

function createEmitterData(err, weather) {
    logger.trace("geeksWeather.js: createEmitterData() entry");
    if(err) {
        logger.error("geeksWeather.js: createEmitterData() err: ", err)
        return;
    } else {
        logger.trace("geeksWeather.js: createEmitterData() after check for no-error");
        obs=weather.current_observation;
        var forecastday=weather.forecast.simpleforecast.forecastday;
        var moon=weather.moon_phase;
        var sun = weather.sun_phase
        logger.trace("geeksWeather.js: createEmitterData() after call to weather.forecast.simpleforecast.forecastday");
        logger.debug("geeksWeather.js: createEmitterData(); forecastday value: ", forecastday);
        logger.debug("geeksWeather.js: createEmitterData(); moon_phase value: ", moon);
        logger.debug("geeksWeather.js: createEmitterData(); sun_phase value: ", sun);

        var server_time_now     = new Date();

        emitter_weather = { 'observation_epoch': obs.observation_epoch, 'observation_time': obs.observation_time, 'temp_f': obs.temp_f,
            'local_time': obs.local_time_rfc822, 'local_epoch': obs.local_epoch,
            'wind_mph': obs.wind_mph, 'wind_gust_mph': obs.wind_gust_mph, 'wind_string': obs.wind_string, 'wind_dir': obs.wind_dir, 'wind_degrees': obs.wind_degrees,
            'relative_humidity': obs.relative_humidity, 'pressure_mb': obs.pressure_mb, 'pressure_in': obs.pressure_in, 'pressure_trend': obs.pressure_trend,
            'dewpoint_f': obs.dewpoint_f, 'feelslike_f': obs.feelslike_f, 'visibility_mi': obs.visibility_mi, 'precip_1hr_in': obs.precip_1hr_in,
            'precip_today_in': obs.precip_today_in, 'icon': obs.icon,
            'city': city, 'state': state, 'zip': zip, 'station': station, 'server_time': server_time_now, 'forecast':forecastday,
            'moon_pctIllum': moon.percentIlluminated, 'moon_ageOfMoon': moon.ageOfMoon, 'moon_phaseofMoon': moon.phaseofMoon, 'moon_hemisphere': moon.hemisphere,
            'moon_moonrise_hr': moon.moonrise.hour, 'moon_moonrise_min': moon.moonrise.minute, 'moon_moonset_hr': moon.moonset.hour, 'moon_moonset_min': moon.moonset.minute,
            'sun_sunrise_hr': sun.sunrise.hour, 'sun_sunrise_min': sun.sunrise.minute, 'sun_sunset_hr': sun.sunset.hour, 'sun_sunset_min': sun.sunset.minute

        }

        logger.debug("geeksWeather.js: createEmitterData(); emitter_weather: ", emitter_weather);
    }
    sendWeatherEvent();
    logger.trace("geeksWeather.js: createEmitterData() exit");
}


//async.series([getAppInfo, createAppServer, getWeatherData],function(err) {
async.series([getAppInfo, getWeatherData], function(err) {

    if(err) {
        logger.error("geeksWeather.js: async.series() error entry: ", err);
        logger.error("geeksWeather.js: async.series() error exit: ");
        return;
    }
});
