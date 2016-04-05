var rootPath = require("geeksweatherconfig").rootPath;
var Datastore = require("nedb");
var CalendarEvent = require("./CalendarEvent");
var EventsOnDate = require("./EventsOnDate");
var AddEventsToCal = require("./AddEventsToCal");
var CreateCal = require("./CreateCal");

var calToValues = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,
  Sep:8,Oct:9,Nov:10,Dec:11};

var valuesToCal = {0:"Jan",1:"Feb",2:"Mar",3:"Apr",4:"May",5:"Jun",6:"Jul",
  7:"Aug",8:"Sep",9:"Oct",10:"Nov",11:"Dec"}

var db = new Datastore({filename: rootPath + "public/database/calEvents.db", autoload: true});

console.log('db: ', db);
console.log('__dirname: ', __dirname);


var self;

function CreateCalWithEvents(year, month) {
  self=this;
  console.log('CreateCalWithEvents.js constructor: year: ' + year + ', month: ' + month);
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
}

CreateCalWithEvents.prototype.getCalEvents = function(callback) {
  console.log('=======================getCalEvents===================');
  console.log('CreateCalWithEvents.js getCalEvents(): entry');
  console.log('CreateCalWithEvents.js calling getEvents() with year: ' + self.year + ', month: ' + self.monthValue);
  self.getEvents(self.year, self.monthValue, function(docs){
    //console.log('CreateCalWithEvents.js getCalEvents(): docs: ', docs);
    self.calEvents = docs;
    console.log('CreateCalWithEvents.js calling CreateCal with year: ' + self.year + ', month: ' + self.monthValue);
    CreateCal(self.year, self.monthValue, function(err, calMonth){
      self.calendarMonth = calMonth;
      console.log('CreateCalWithEvents.js getCalEvents: calendarMonth: ', self.calendarMonth);
    });
    self.insertEventsIntoCal(function() {

    });
  });
  callback(null, self.calMonth);
};

CreateCalWithEvents.prototype.insertEventsIntoCal = function(callback) {
  console.log('CreateCalWithEvents.js: insertEventsIntoCal() entry');
  var i;
  var j;
  for(i=0;i<self.calEvents.length; i++) {
    console.log('self.calEvents[' + i + '].date: ', self.calEvents[i]);
    self.calendarMonth.byDay[self.calEvents[i].date].events.push(self.calEvents[i]);
    self.calendarMonth.byDay[self.calEvents[i].date].eventToday=true;
  }

  console.log('Calendar Events');
  for(i=1; i<self.calendarMonth.byDay.length; i++) {
    var firstWord = self.calendarMonth.byDay[i]; //convenience
    for(j=0;j<firstWord.events.length; j++) {
      var secondWord = firstWord.events[j]; //convenience
      console.log(secondWord.month +
        '\/' + secondWord.date +
        '\/' + secondWord.year +
        ' event: ' + j +
        ' eventType: ' + secondWord.eventType +
        ' text: ' + secondWord.text +
        ' id: ' + secondWord._id
      );
    }
  }
  console.log('==========byCal============');
  for(i=0; i<self.calendarMonth.byCal.length; i++) {
    console.log('calendar position: ' + i + ': ', self.calendarMonth.byCal[i]);
  }
}

CreateCalWithEvents.prototype.getEvents = function(year, month, callback) {
  console.log('===============getEvents===============');
  console.log('CreateCalWithEvents.js getEvents() entry');
  if(!isNaN(month)) {
    self.monthName = valuesToCal[month];
    self.monthValue = month;
  } else {
    self.monthName = month;
    self.monthValue = calToValues[month];
  }

  console.log('CreateCalWithEvents.js getEvents(): year: ' + year + ' month: ' + self.monthName);
  console.log('CreateCalWithEvents.js getEvents(): calling db.find()');
  db.find({$and: [{ "year":year}, { "month":self.monthName}]}, function(err, docs) {
    //console.log('CreateCalWithEvents.js getEvents() in callback for db.find: docs: ', docs);
    callback(docs);
  });
};

module.exports = CreateCalWithEvents;
