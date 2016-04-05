var rootPath = require("geeksweatherconfig").rootPath;
var calEvents = require(rootPath + "calEvents.db");

function getEvents() {
  console.log("calendar.js getEvents() entry");

  var calEvents={ 'month':[
    {'name':'Jan','events':[
    ]},
    {'name':'Feb','events':[
    ]},

  ]};
  return calEvents;
}

var calEvents = getEvents();
var date = new Date();
var todayDate = date.getDate();
var todayMonth = date.getMonth();
console.log('calEvents: ', calEvents);
console.log('calEvents.month:', calEvents.month);
console.log('calEvents.month.events:', calEvents.month.events);
var theEvent=""
var eventString = "<section style='font-weight:bold; font-size:50px '>";
var nextMonth = (todayMonth + 1) % 12;
for(i=todayMonth;i<=nextMonth; i++) { //this month and next month
  console.log('calEvents.month[' + i + ']:', calEvents.month[i]);
  console.log('calEvents.month[' + i + '].events.length: ' + calEvents.month[i].events.length);
  for(j=0;j<calEvents.month[i].events.length; j++) {
    var eventDate = calEvents.month[i].events[j].date;
    var month = calEvents.month[i].name;
    var theEvent = calEvents.month[i].events[j].event;
    var date = calEvents.month[i].events[j].date;
    var text = calEvents.month[i].events[j].text;
    if(todayDate <= eventDate && i == todayMonth) {
      eventString = eventString + ' ' + month + ' ' + eventDate + ': ' + theEvent + ': ' + text + ' <br><br>';
    } else if(i==nextMonth) {
      eventString = eventString + ' ' + month + ' ' + eventDate + ': ' + theEvent + ': ' + text + ' <br><br>';
    }
  }
  if(i==todayMonth)
    eventString = eventString + "<hr>"
  console.log('eventString: ' + eventString);
  $("#event").html(eventString);
}

console.log("calendar.js getEvents() exit");
