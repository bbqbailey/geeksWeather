var Wunderground = require('wundergroundnode');
var Datastore    = require('nedb');
var async        = require("async");
var log4js       = require('log4js');
var express      = require('express');
var bodyParser   = require('body-parser');
var path         = require('path');

var app = express();

var logger = log4js.getLogger();
logger.setLevel('TRACE'); //In order: ALL, TRACE, DEBUG, INFO, WARN, ERROR, FATAL

const SECOND = 1000;
const MINUTE = SECOND * 60;
const WUNDERGROUND_GET_TIME = 5 * MINUTE;
//const WEATHER_SEND_TIME = WUNDERGROUND_GET_TIME - 1;
const TIME_SEND_TIME = 1 * SECOND;
const DEFAULT_FILE = "timeAndWeather";

var wgInfo = new Datastore( { filename: './myWundergroundInfo.db', autoload: true });
var emitter_weather={};
var connections=[];
var wunderground; //defined in getAppInfo()
var wunderground_weather={}; //contains weather info returned by Wunderground.com API


app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true}));
//or app.use(bodyParser.json()) if urlencoded is incorrect;

app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.set('views', __dirname + '/views');

app.get('/eventEngine' , function(req, res) {
    logger.trace('app.get(/eventEngine) entry');
    connections.push(res);
    logger.debug("Added a connection; connections.length: " + connections.length);
    res.writeHead(200, {
        "Content-type":"text/event-stream", 
        "Cache-Control":"no-cache", 
        "Connection":"keep-alive"
    });
    sendWeather();
    
    req.on("close", function() {
        logger.trace("req.on close");
        var toRemove;
        for(var i=0;i<connections.length; i++) {
            if(connections[i] == res) {
                toRemove=i;
                break;
            }
        }
        connections.splice(i,1);
        logger.debug("Removed a connection; connections.length: " + connections.length);
    });
    logger.trace("app.get(/eventEngine) exit");
});

app.get('/', function(req, res, next) {
    logger.trace('app.get(/) entry - rendering DEFAULT_FILE');
    res.render(DEFAULT_FILE);
    logger.trace('app.get(/) exit');
});

app.get('/timeAndWeather', function(req, res, next) { //renders __dirname/views/index.jade
    logger.trace('app.get(/timeAndWeather) entry');
    res.render('timeAndWeather');
    logger.trace("app.get(/timeAndWeather) exit");
});

app.get('/about', function(req, res, next) {
    logger.trace('app.get(/about) entry');
    res.render('about');
    logger.trace('app.get(/about exit');
});

app.get('/headers', function(req, res, next) {
    logger.trace('app.get(/headers) entry');
    res.render('headers');
    logger.trace('app.get(/headers) exit');
});

app.get('/southernMissRadar', function(req, res, next) {
    logger.trace('app.get(/southernMissRadar');
    res.sendFile('southernMissRadar.html', {root: path.join(__dirname, 'public/images') });

    logger.trace('app.get(/southernMissRadar');
});

app.listen(8080, function (err) {
    logger.info('Express started on port 8080');
});


var wundergroundInterval = setInterval(function() {
    logger.trace("setInterval(getWeatherData()) entry");
    getWeatherData();
    logger.trace("setInterval(getWeatherData()) exit");
}, WUNDERGROUND_GET_TIME);

//var weatherInterval = setInterval(sendWeather, WEATHER_SEND_TIME);

var dateInterval = setInterval(function() {
    logger.trace("setInterval(sendTime()) entry");
    sendTime();
    logger.trace("setInterval(sendTime()) exit");
}, TIME_SEND_TIME);



function sendWeather() {
    logger.trace("sendWeather() entry");
    var weatherJson = JSON.stringify(emitter_weather);
    sendConnections(weatherJson, 'weather');
    logger.trace("sendWeather() exit");
}

function sendTime() {
    logger.trace("sendTime() entry");
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
    
    timeJson = JSON.stringify(time_data);
    sendConnections(timeJson,'time');
    logger.debug("Number of connections: " + connections.length);
    logger.trace("sendTime() exit");
}

function sendConnections(data, event) {
    logger.trace("sendConnections() entry");
    logger.trace("sendConnections() data: ", data);
    logger.debug("sendConnections() event: ", event);
    for(var i=0; i<connections.length; i++ ) {
        connections[i].write('event: ' + event + '\n');
        connections[i].write('data: ' + data + '\n\n');
    }
    logger.trace("sendConnections() exit");
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
    logger.trace("getAppInfo() exit");
}

//gets weather data and stores it
function getWeatherData(callback) {
    logger.trace("getWeatherData() entry");
    wunderground.conditions().forecast().request('pws/q/pws:' + station, processWundergroundData);

    if (typeof callback === "function")
        callback();
    sendWeather();    
    logger.trace("getWeatherData() exit");
}

function processWundergroundData(err, weather) {
    logger.trace("processWundergroundData() entry");
//    dbInsertWeatherData(err, weather);
    createEmitterData(err, weather);
//    showWundergroundData(err, weather);
    logger.trace("processWundergroundData() exit");
}

function createEmitterData(err, weather) {
    logger.trace("createEmitterData() entry");
    if(err) {
        logger.error("createEmitterData() err: ", err) 
        return;
    } else {
        logger.trace("createEmitterData() after check for no-error");
        var obs=weather.current_observation;
        var forecastday=weather.forecast.simpleforecast.forecastday;
        logger.trace("createEmitterData() after call to weather.forecast.simpleforecast.forecastday");
        logger.debug("createEmitterData(); forecastday value: ", forecastday);
       
        var server_time_now     = new Date();
        
        emitter_weather = { 'observation_epoch': obs.observation_epoch, 'observation_time': obs.observation_time, 'temp_f': obs.temp_f, 
            'local_time': obs.local_time_rfc822, 'local_epoch': obs.local_epoch, 
            'wind_mph': obs.wind_mph, 'wind_gust_mph': obs.wind_gust_mph, 'wind_string': obs.wind_string, 'wind_dir': obs.wind_dir, 'wind_degrees': obs.wind_degrees,
            'relative_humidity': obs.relative_humidity, 'pressure_mb': obs.pressure_mb, 'pressure_in': obs.pressure_in, 'pressure_trend': obs.pressure_trend,
            'dewpoint_f': obs.dewpoint_f, 'feelslike_f': obs.feelslike_f, 'visibility_mi': obs.visibility_mi, 'precip_1hr_in': obs.precip_1hr_in, 
            'precip_today_in': obs.precip_today_in, 'icon': obs.icon,
            'city': city, 'state': state, 'zip': zip, 'station': station, 'server_time': server_time_now, 'forecast':forecastday
        }

        logger.debug("createEmitterData(); emitter_weather: ", emitter_weather);
    }
    logger.trace("createEmitterData() exit");
}


//async.series([getAppInfo, createAppServer, getWeatherData],function(err) {
async.series([getAppInfo, getWeatherData, sendWeather], function(err) {

    if(err) {
        logger.error("========================async.series error: ", err);
         return;
    }
});

