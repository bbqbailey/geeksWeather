var Datastore = require("nedb");
var path = require("path");
var rootPath = require("geeksweatherconfig").rootPath;


function Myapp(year, month) {
  console.log('============================myapp.js=================');
  console.log('myapp: year: ' + year + ', month: ' + month);
  this.year = year;
  this.month = month;
}

Myapp.prototype.getAllData = function(callback) {
  console.log('=================myapp.js db.find being invoked.');
  var db = new Datastore({filename: rootPath + "public/database/calEvents.db", autoload: true});
  console.log('db: ', db);
  db.find({}, function(err, docs) {
    if(err) {
      console.log('=================myapp.js error: ', err);
    } else {
      console.log("=================myapp.js docs found: ", docs);
    }

    callback(err, docs);
  });
  console.log('=================myapp.js after db.find');
};

module.exports = Myapp;
