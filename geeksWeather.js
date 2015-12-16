var Wunderground = require('wundergroundnode');
var Datastore    = require('nedb');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var db     = new Datastore( { filename: './wunderground.db', autoload: true });
var wgInfo = new Datastore( { filename: './myWundergroundInfo.db', autoload: true });

var id; //definefd in getData()

var wunderground; //defined in getWUInfo()
var myKey=""; //defined in getWUInfo()
var city="";
var state="";
var zip="";
var station=""

var emitter_weather={};


//get your stored key you obtained from wunderground.com
//If errors, then be sure you have added your key to file 'create_wundergroundInfo.js'
//then run the js via 'nodejs create_wundergroundInfo.js' to create
//your keyfile ./myWundergroundInfo.db
//
function getWUInfo() {
    console.log("getWUInfo() entry");
    wgInfo.find({}, function(err, keyDoc) {
        if(err) {
            console.log("getWUInfo() exit on error");
            return;
        }
        console.log("keyDoc: ", keyDoc[0]);
        myKey=keyDoc[0].myKey;
        city=keyDoc[0].city;
        state=keyDoc[0].state;
        zip=keyDoc[0].zip;
        station=keyDoc[0].station;
        console.log("Proceeding with key: ", myKey);
        wunderground = new Wunderground(myKey);
        console.log("getWUInfo() exit");
        processWeatherData();
    });
}



function createEmitterData(err, weather) {
    if(err) {
        console.log("createEmitterData() err: ", err) 
        return;
    } else {
        console.log("createEmitterData() entry");
        obs=weather.current_observation;
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
        var precip_today_in     = obs.precip_today_in;
        var icon                = obs.icon;

        emitter_weather = { 'observation_time': observation_time, 'temp_f': temp_f, 'local_time': local_time, 'local_epoch': local_epoch, 
            'wind_mph': wind_mph, 'wind_gust_mph': wind_gust_mph, 'wind_string': wind_string, 'wind_dir': wind_dir, 'wind_degrees': wind_degrees,
            'relative_humidity': relative_humidity, 'pressure_mb': pressure_mb, 'pressure_in': pressure_in, 'pressure_trend': pressure_trend,
            'dewpoint_f': dewpoint_f, 'feelslike_f': feelslike_f, 'visibility_mi': visibility_mi, 'precip_today_in': precip_today_in, 'icon': icon,
            'city': city, 'state': state, 'zip': zip, 'station': station 
        }

        eventEmitter.emit('newWeatherData', emitter_weather);
        console.log("createEmitterData() exit; emitter_weather: ", emitter_weather);
    }
}

function dbInsertWeatherData(err, weather) {
    console.log("dbInsertWeatherData() entry");
    
    createEmitterData(err, weather); //yeah!  asynch
    
    db.insert(weather, function(err, doc) {
        if(err) {
            console.log("dbInsertWeatherData() error: ", err);
            return;
        } else {

            id=doc._id;

            obs=weather.current_observation;

            console.log("local_time: ", obs.local_time_rfc822);
            console.log("record id: ", id);
            console.log("temp_f: ", obs.temp_f);
            console.log();
       
            local_epoch_val = parseInt(obs.local_epoch);
            db.update({ _id: id }, { $set: { 'local_epoch_val': local_epoch_val } });
        }
    });
    console.log("dbInsertWeatherData() exit");
}


//gets weather data and stores it
function processWeatherData() {
    console.log("processWeatherData() entry");
    wunderground.conditions().request('pws/q/pws:' + station, dbInsertWeatherData);

    console.log("processWeatherData() exit");
}

//=========================active program starts

getWUInfo();

var minute = 1000 * 60; //useful substitution 
setInterval(processWeatherData, 5 * minute); //schedule next run
