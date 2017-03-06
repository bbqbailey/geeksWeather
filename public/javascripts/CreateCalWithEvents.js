//var rootPath = require("geeksweatherconfig").rootPath;
var CreateCal = require("./CreateCal");
var log4js = require('log4js'); //Bengy


logger = log4js.getLogger('geeksWeather');

var calToValues = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,
  Sep:8,Oct:9,Nov:10,Dec:11};

var valuesToCal = {0:"Jan",1:"Feb",2:"Mar",3:"Apr",4:"May",5:"Jun",6:"Jul",
  7:"Aug",8:"Sep",9:"Oct",10:"Nov",11:"Dec"}


var self;
function CreateCalWithEvents(year, month) {
  logger.trace("CreateCalWithEvents.ja constructor entry");
  self=this;  //'this' context changes, so get reference for current contect.  Not like Java 'this'
  if(isNaN(month)) {
    self.monthName = month;
    self.monthValue=calToValues[month];
  } else {
    self.monthName = valuesToCal[month];
    self.monthValue = month;
  }
  self.year = year;
  self.calEvents;
  self.calendarMonth = {};

  logger.trace("CreateCalWithEvents.js constructor exit");
}

CreateCalWithEvents.prototype.getCalEvents = function(callback) {
  logger.trace("CreateCalWithEvents.js getCalEvents() entry");

  var docs;
  var err;

  self.getEvents(self.year, self.monthValue, function(err, docs) {
    if(err) {
      console.log('====ERROR====CreateCalWithEvents.js getCalEvents() received error: ', err);
      logger.error("CreateCalWithEvents.js getEvents() exit on err");
      callback(err, null);
    } else {
      self.calEvents = docs;
      //console.log('CreateCalWithEvents.js calling CreateCal with year: ' + self.year + ', month: ' + self.monthValue);
      CreateCal(self.year, self.monthValue, function(err, calMonth){
        self.calendarMonth = calMonth; //an object with two elements:
//        console.log('CreateCalWithEvents.js getCalEvents: calendarMonth: ', self.calendarMonth);
      });
      console.log('CreateCalWithEvents.js calling insertEventsIntoCal');
      self.insertEventsIntoCal(function() {
          logger.trace("CreateCalWithEvents.js - callback from call to insertEventsIntoCal.");
      });
      console.log('CreateCalWithEvents.js after return from insertEventsIntoCal');
      logger.trace("CreateCalWithEvents.js - getEvents() invoking callback."); //Bengy
      callback(null, docs);
    };
  });
};

CreateCalWithEvents.prototype.insertEventsIntoCal = function(callback) {
  logger.trace("CreateCalWithEvents.js insertEventsIntoCal() entry");

  var i;
  var j;
  for(i=0;i<self.calEvents.length; i++) {
    self.calendarMonth.byDay[self.calEvents[i].date].events.push(self.calEvents[i]);
    self.calendarMonth.byDay[self.calEvents[i].date].eventToday=true;
  }

  for(i=1; i<self.calendarMonth.byDay.length; i++) {
    var firstWord = self.calendarMonth.byDay[i]; //convenience
    for(j=0;j<firstWord.events.length; j++) {
      var secondWord = firstWord.events[j]; //convenience
    }
  }
  logger.trace("CreateCalWithEvents.js invoking callback"); //Bengy
  callback();
  logger.trace("CreateCalWithEvents.js insertEventsIntoCal() exit");

}

CreateCalWithEvents.prototype.getEvents = function(year, month, callback) {
  logger.trace("CreateCalWithEvents.js getEvents() entry");

  if(!isNaN(month)) {
    self.monthName = valuesToCal[month];
    self.monthValue = month;
  } else {
    self.monthName = month;
    self.monthValue = calToValues[month];
  }

  var docs;
//  db.find({$and: [{ "year":year}, { "month":self.monthName}]}, function(err, docs) {
  db.find( {$or : [ {$and : [{ "year":self.year},{"month":self.monthName}]}, {$and : [{ "recurs":"YearlyOnDate"},{"month":self.monthName}]}]}).sort({date:1}).exec(function(err, docs) {
    if(err) {
      logger.error('====ERROR====CreateCalWithEvents.js  getEvents(): db.find() error: ', err);
      callback(err, null);
    } else {
      logger.trace("CreateCalWithEvents.js getEvents() invoking callback");
      callback(null, docs);
    }
  });
  logger.trace("CreateCalWithEvents.js getEvents() exit");
};

module.exports = CreateCalWithEvents;
