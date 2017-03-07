var Datastore = require("nedb");
var fs = require("fs");

var rootPath =require("geeksweatherconfig").rootPath;
var natEvents = require(rootPath + "public/database/_calNationalEvents.json");


var db = new Datastore({filename: rootPath + "public/database/calEvents.db", autoload: true});
fs.exists(rootPath + "public/database/_calPersonalNew.json", function(val) {
  if(val) {
    var perEvents = require(rootPath + "public/database/_calPersonalNew.json")
    db.insert(perEvents.CalendarEvents, function(err, newDoc) {
      if(err) {
        console.log('=======db.insert err for _calPersonalEvents: ', err);
        return;
      }
      console.log('_calPersonalEvents insert: ', newDoc);
    });
  } else {
    console.log('_calPersonalEvents.jsno does not exist.');
  }
});


