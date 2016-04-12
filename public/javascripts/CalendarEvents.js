/**
*
* CalendarEvents.js
*
* uses:
*   geeksweatherconfig
*   nedb
*
* purpose:
*   Builds a up an html output of calendar events that are taking place this month.
*   The resultant events are sorted, earliest first.  Events prior to 'today' aren't shown.
*
**/

var rootPath = require("geeksweatherconfig").rootPath;
var Datastore = require("nedb");

var calToValues = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,
  Sep:8,Oct:9,Nov:10,Dec:11};

var valuesToCal = {0:"Jan",1:"Feb",2:"Mar",3:"Apr",4:"May",5:"Jun",6:"Jul",
  7:"Aug",8:"Sep",9:"Oct",10:"Nov",11:"Dec"}

var docs;

var self;
function CalendarEvents(year, month) {
  self = this;
  self.date = new Date();
  self.todayDate = self.date.getDate();
  self.todayMonth = self.date.getMonth();
  self.todayMonthName = valuesToCal[self.todayMonth];
  self.todayYear = self.date.getFullYear();
  self.fullYear = year;
  self.month = month;

};

CalendarEvents.prototype.getEvents = function(callback) {
  var todayDate = self.todayDate;
  console.log('CalendarEvents.js getEvents() entry');
  console.log('=============================================================todayDate: ', todayDate);
  console.log('getEvents(): self.date: ' + self.date);
  console.log('getEvents(): self.todayMonthName: ' + self.todayMonthName);
  db.find({$and: [{ "year":self.todayYear}, { "month":self.todayMonthName}]}).sort({date:1}).exec(function(err, docs) {
    if(err) {
      console.log('CreateCalWithEvents.js db.find() error: ', err);
    } else {
      self.htmlConvert(docs, function(err, docs) {
        callback(err, docs);
      });
    }
  });
}

CalendarEvents.prototype.htmlConvert = function(calendarEvents, callback) {
  //console.log('CalendarEvents.js showEvents(): entry');
  //console.log('CalendarEvents.js showEvents(): calendarEvents: ', calendarEvents);
  var theEvent=""
  var eventString = "<section style='font-weight:bold; font-size:50px '>";
  var nextMonth = (self.todayMonth + 1) % 12;
  var i;
  console.log('calendarEvents.length: ' + calendarEvents.length);
  console.log('===============================Events this Month======================');
  for(i=0; i<calendarEvents.length; i++) { //all items for found month
    var eventDate = calendarEvents[i].date;
    var month = calendarEvents[i].month;
    var theEvent = calendarEvents[i].event;
    var date = calendarEvents[i].date;
    var text = calendarEvents[i].text;
    //eventString = eventString + ' ' + month + ' ' + eventDate + ': ' + theEvent + ': ' + text + ' <br><br>';
    if(self.todayDate <= eventDate) {
      eventString += month + ' ' + eventDate + ': ' + theEvent + ': ' + text + ' <br><br>';
    }
  };
  //$("#event").html(eventString);
  console.log('eventString: ' + eventString);
  callback(null, eventString);
};

console.log("calendar.js getEvents() exit");



module.exports=CalendarEvents;
