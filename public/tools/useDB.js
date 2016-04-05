/**
*
* Usage: nodejs useDB.js
*
**/
var Datastore = require("nedb");
var rootPath = require("geeksweatherconfig").rootPath;

var db = new Datastore({filename: rootPath + "public/database/calEvents.db", autoload: true});

db.find({}, function(err, docs) {
  console.log('================finding all=======================');
  console.log(" finding {}: ", docs);
})

db.find({"event":"calEvent"}, function(err, docs) {
  if(err) {
    console.log('err: ', err);
  } else {
    console.log('===============find("event":"calEvent")');
    console.log('========docs: ', docs)
    console.log('========docs[0]', docs[0])
  }
});

db.find({$and: [{"event":"calEvent"}, { "month":"Jul"}]}, function(err, docs) {
  console.log('==============find $and event:calEvent, month:JUL');
  if(err) {
    console.log('err: ', err);
  } else {
    console.log("============docs: ", docs);
  }
  });

db.find({"month":"Mar"}).sort({"date":1}) .exec(function(err, docs) {
  console.log('=============find month:Mar sorted by date');
  if(err) {
    console.log('err: ', err);
  } else {
    console.log("============find month:Mar: sorted by date ", docs);
  }
  });


db.find({$and: [{"event":"calEvent"}, { "year":2016}, { "month":"Mar"}]}, function(err, docs) {
    if(err) {
      console.log('err: ', err);
    } else {
      console.log('=============find event and year and month', docs);
    }
  }
);
