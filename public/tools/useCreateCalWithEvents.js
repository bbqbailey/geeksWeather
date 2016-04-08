
var rootPath =require("geeksweatherconfig").rootPath;
var CreateCalWithEvents = require(rootPath + "public/javascripts/CreateCalWithEvents");

var calWithEvents = new CreateCalWithEvents(2016, "Apr");

var calEvents;

calWithEvents.getCalEvents(function(err, calEvents) {
  if(err) {
    console.log('CreateCalWithEvents.js: getCalEvents error: ', err);
  } else {
    console.log("useCreateCalWithEvents.js : calEvents: ", calEvents);
    console.log('useCreateCalWithEvents.js : calWithEvents: ', calWithEvents.calendarMonth);
  }
});



/*
calWithEvents.getEvents(2016, "Mar", function(events) {
  console.log('useCreateCalWithEvents.js: events: ', events);
});
*/

//calWithEvents.getAllData();
