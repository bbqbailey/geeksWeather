var Datastore = require("nedb");
var natEvents = require("./_calNationalEvents.json");
var perEvents = require("./_calPersonalEvents.json")

var db = new Datastore({filename: "calEvents.db", autoload: true});

db.insert(natEvents.CalendarEvents, function(err, newDoc) {
  if(err) {
    console.log('=====================db.insert err: ', err);
    return;
  }
  console.log('natEvents insert: ', newDoc);
});

db.insert(perEvents.CalendarEvents, function(err, newDoc) {
  if(err) {
    console.log('=====================db.insert err: ', err);
    return;
  }
  console.log('perEvents insert: ', newDoc);
});

db.insert({"eventTypes":[{event:"Birthday"}, {event:"WeddingAnniversary"}, {event:"Meeting"},     {event:"Holiday"},{event:"Event"}]},
  function(err) {
    if(err) {
      console.log("=====================================error: ", err);
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
