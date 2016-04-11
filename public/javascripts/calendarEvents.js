/**
*
* calendarEvents.js
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
var db = new Datastore({filename: rootPath + "public/database/calEvents.db", autoload: true});

var calToValues = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,
  Sep:8,Oct:9,Nov:10,Dec:11};

var valuesToCal = {0:"Jan",1:"Feb",2:"Mar",3:"Apr",4:"May",5:"Jun",6:"Jul",
  7:"Aug",8:"Sep",9:"Oct",10:"Nov",11:"Dec"}

//var calEvents = getEvents();
var self = this;
self.date = new Date();
self.todayDate = self.date.getDate();
self.todayMonth = self.date.getMonth();
self.todayMonthName = valuesToCal[self.todayMonth];
self.todayYear = self.date.getFullYear();


var docs;

getEvents(function(err, calEvents) {
  console.log('calendarEvents.js getEvents() return');
  //console.log('calendarEvents.js getEvents() return: calEvents: ', calEvents);
  console.log('calendarEvents.js getEvents(): calling showEvents with calEvents');
  showEvents(calEvents);
})

function getEvents(callback) {
  var todayDate = self.todayDate;
  console.log('calendarEvents.js getEvents() entry');
  console.log('=============================================================todayDate: ', todayDate);
  console.log('getEvents(): self.date: ' + self.date);
  console.log('getEvents(): self.todayMonthName: ' + self.todayMonthName);
  db.find({$and: [{ "year":self.todayYear}, { "month":self.todayMonthName}]}).sort({date:1}).exec(function(err, docs) {
    if(err) {
      console.log('CreateCalWithEvents.js db.find() error: ', err);
    } else {
      console.log('calendarEvents.js getEvents() db.find callback success.');
      //console.log('calendarEvents.js getEvents() db.find callback: docs: ', docs);
    }
    //console.log('calendarEvents.js getEvents() before callback.');
    callback(err, docs);
  });
}


function showEvents(calEvents) {

  console.log('calendarEvents.js showEvents(): entry');
  console.log('calendarEvents.js showEvents(): calEvents: ', calEvents);
  var theEvent=""
  var eventString = "<section style='font-weight:bold; font-size:50px '>";
  var nextMonth = (self.todayMonth + 1) % 12;
  var i;
  console.log('calEvents.length: ' + calEvents.length);
  console.log('===============================Events this Month======================');
  for(i=0; i<calEvents.length; i++) { //all items for found month
    console.log('calEvents[' + i + '].month:', calEvents[i].month);
    var eventDate = calEvents[i].date;
    var month = calEvents[i].month;
    var theEvent = calEvents[i].event;
    var date = calEvents[i].date;
    var text = calEvents[i].text;
    //eventString = eventString + ' ' + month + ' ' + eventDate + ': ' + theEvent + ': ' + text + ' <br><br>';

    if(self.todayDate <= eventDate) {
      eventString = eventString + ' ' + month + ' ' + eventDate + ': ' + theEvent + ': ' + text + ' <br><br>';
    }


    if(i==self.todayMonth)
      eventString = eventString + "<hr>"
    console.log('eventString: ' + eventString);
    $("#event").html(eventString);
  };
};

console.log("calendar.js getEvents() exit");
