var rootPath = require("geeksweatherconfig").rootPath;
var Calendar = require(rootPath + "public/javascripts/Calendar");
var CreateCalWithEvents = require(rootPath + "public/javascripts/CreateCalWithEvents");

var EventType={
  Birthday:'border-top:20px solid #ff0000;',
  Appointment:'border-right:20px solid #00ff00;',
  Holiday:'border-bottom:20px solid #0000ff;',
  Misc:'border-left:20px solid #909090;',
  Today:'color:red;',
  Trip:'background-color:green;'
  }

buildCalendar(function(err, calWithEvents) {
  if(err) {
    console.log('==========ERROR====useCalendar.js buildCalendar() callback err: ', err);
  } else {
    console.log('useCalendar.js buildCalendar() callback success, calWithEvents: ', calWithEvents);
  }
  console.log('useCalendar.js program exit.');
});


function buildCalendar(callback) {
  var date = new Date();
  var fullYear = date.getFullYear();
  var month = date.getMonth();
  var calWE = new CreateCalWithEvents(fullYear, month);
  var calWithEvents;
  calWE.getCalEvents(function(err, calEvents) {
    var calendar = new Calendar();
    calendar.buildHTML(EventType, calWE.calendarMonth, function(err, stringifyCalWithEvents) {
      //console.log('=====useCalendar.js buildCalendar() in callback after return from calendar.buildHTML()====');
      if(err) {
        console.log('========ERROR========== useCalendar.js buildCalendar(): calendar.buildHTML() error: ', err);
      } else {
        callback(null, stringifyCalWithEvents);
      }
    });
  });
}
