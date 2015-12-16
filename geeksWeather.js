var Wunderground = require('wundergroundnode');
var wunderground;
var myKey="";
var Datastore = require('nedb');
var db = new Datastore( { filename: './wunderground.db', autoload: true });
var myKeyDB = new Datastore( { filename: './myWundergroundKey.db', autoload: true });
var weather = {};
var id;


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
        getData();
    });
}



function getData() {
    console.log("getData() entry");
    wunderground.conditions().request('pws/q/pws:KGAALPHA23', function(err, response){
        weather = response;
        var temp_f = weather.current_observation.temp_f;
        var local_epoch = weather.current_observation.local_epoch;
        console.log();

        var local_epoch_val = parseInt(local_epoch);
        var newDoc;

        db.insert(weather, function(err, doc) {
            id=doc._id;
            console.log("Inserting into db==============================");
            console.log("err: ", err);

            console.log("weather typeof: ", typeof weather);
            console.log("local_epoch: ", local_epoch);
            console.log("local_epoch_val: ",  local_epoch_val);
            console.log("id: ", id);
            console.log();
       

            console.log("after inserting - testing id: ", id);

            db.find({ _id: id }, function(err, doc) {
                console.log("finding =====================================");
            });

            db.update({ _id: id }, { $set: { 'local_epoch_val': local_epoch_val } }, {}, function(){
                console.log("updating ===================================");
            });

            db.find({ _id: id },function(err, newDoc) {
                console.log("finding again===============================");
            });

        });

   });
}

getKey();

var minute = 1000 * 60;
setInterval(getData, 5 * minute);
