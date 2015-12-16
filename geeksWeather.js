var Wunderground = require('wundergroundnode');
var Datastore    = require('nedb');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var db           = new Datastore( { filename: './wunderground.db', autoload: true });
var myKeyDB      = new Datastore( { filename: './myWundergroundKey.db', autoload: true });

var id; //definefd in getData()
var wunderground; //defined in getKey()
var myKey=""; //defined in getKey()
var emitter_weather={};


//get your stored key you obtained from wunderground.com
//If errors, then be sure you have added your key to file 'create_wundergroundKey.js'
//then run the js via 'nodejs create_wundergroundKey.js' to create
//your keyfile ./myWundergroundKey.db
//
function getKey() {
    console.log("getKey() entry");
    myKeyDB.find({}, function(err, keyDoc) {
        if(err) {
            console.log("getKey() exit on error");
            return;
        }
        console.log("keyDoc: ", keyDoc[0]);
        myKey=keyDoc[0].my_key;
        console.log("Proceeding with key: ", myKey);
        wunderground = new Wunderground(myKey);
        console.log("getKey() exit");
        processWeatherData();
    });
}



function createEmitterData(err, weather) {
    if(err) {
        console.log("createEmitterData() err: ", err) 
        return;
    } else {
        console.log("createEmitterData() entry");
        var observation_time    = weather.current_observation.observation_time; 
        var temp_f              = weather.current_observation.temp_f;
        var local_time          = weather.current_observation.local_time_rfc822; 
        var local_epoch         = weather.current_observation.local_epoch;
        var wind_mph            = weather.current_observation.wind_mph;
        var wind_gust_mph       = weather.current_observation.wind_gust_mph;
        var wind_string         = weather.current_observation.wind_string;
        var wind_dir            = weather.current_observation.wind_dir;
        var wind_degrees        = weather.current_observation.wind_degrees;
        var relative_humidity   = weather.current_observation.relative_humidity; 
        var pressure_mb         = weather.current_observation.pressure_mb;
        var pressure_in         = weather.current_observation.pressure_in; 
        var pressure_trend      = weather.current_observation.pressure_trend; 
        var dewpoint_f          = weather.current_observation.dewpoint_f;
        var feelslike_f         = weather.current_observation.feelslike_f;
        var visibility_mi       = weather.current_observation.visibility_mi;
        var precip_today_in     = weather.current_observation.precip_today_in;
        var icon                = weather.current_observation.icon;

        emitter_weather = { 'observation_time': observation_time, 'temp_f': temp_f, 'local_time': local_time, 'local_epoch': local_epoch, 
            'wind_mph': wind_mph, 'wind_gust_mph': wind_gust_mph, 'wind_string': wind_string, 'wind_dir': wind_dir, 'wind_degrees': wind_degrees,
            'relative_humidity': relative_humidity, 'pressure_mb': pressure_mb, 'pressure_in': pressure_in, 'pressure_trend': pressure_trend,
            'dewpoint_f': dewpoint_f, 'feelslike_f': feelslike_f, 'visibility_mi': visibility_mi, 'precip_today_in': precip_today_in, 'icon': icon }

        eventEmitter.emit('newWeatherData', emitter_weather);
        console.log("createEmitterData() exit");
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
       
            local_epoch_val = parseInt(weather.current_observation.local_epoch);
            db.update({ _id: id }, { $set: { 'local_epoch_val': local_epoch_val } });
        }
    });
    console.log("dbInsertWeatherData() exit");
}


//gets weather data and stores it
function processWeatherData() {
    console.log("processWeatherData() entry");
    wunderground.conditions().request('pws/q/pws:KGAALPHA23', dbInsertWeatherData);

    console.log("processWeatherData() exit");
}

//=========================active program starts

getKey();

var minute = 1000 * 60; //useful substitution 
setInterval(processWeatherData, 5 * minute); //schedule next run
