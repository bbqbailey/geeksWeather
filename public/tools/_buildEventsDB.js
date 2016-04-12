var Datastore = require("nedb");
var fs = require("fs");

var rootPath =require("geeksweatherconfig").rootPath;
var natEvents = require(rootPath + "public/database/_calNationalEvents.json");


var db = new Datastore({filename: rootPath + "public/database/calEvents.db", autoload: true});

db.insert(natEvents.CalendarEvents, function(err, newDoc) {
  if(err) {
    console.log('=====================db.insert err: ', err);
    return;
  }
  console.log('natEvents insert: ', newDoc);
  console.log('finished db.insert()');
});

fs.exists(rootPath + "public/database/_calPersonalEvents.json", function(val) {
  if(val) {
    var perEvents = require(rootPath + "public/database/_calPersonalEvents.json")
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


db.insert({"eventTypes":[{event:"Birthday"}, {event:"Appointment"}, {event:"Meeting"}, {event:"Holiday"}, {event:"Misc"}, {event:"Trip"}]},
  function(err) {
    if(err) {
      console.log("=====================================error: ", err);
    } else {
      console.log('Inserted the valid eventTypes into db.');
    }
  });

db.insert({"months":[{sName:"Jan",lName:"January"},{sName:"Feb",lName:"February"},{sName:"Mar", lName:"March"},{sName:"Apr",lName:"April"},{sName:"May",lName:"May"},{sName:"Jun",lName:"June"},{sName:"Jul",lName:"July"},{sName:"Aug",lName:"August"},{sName:"Sep",lName:"September"},{sName:"Oct",lName:"October"},{sName:"Nov",lName:"November"},{sName:"Dec",lName:"December"}]}, function(err) {
  if(err) {
    console.log("=======================================error: ", err);
  }
});

db.insert({elem:"monthsVal",Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11}, function(err) {
  if(err) {
    console.log("=======================================error: ", err);
  }
});
