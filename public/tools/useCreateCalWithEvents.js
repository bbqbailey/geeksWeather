
var rootPath =require("geeksweatherconfig").rootPath;
var CreateCalWithEvents = require(rootPath + "public/javascripts/CreateCalWithEvents");

var calWithEvents = new CreateCalWithEvents(2016, "Mar");


calWithEvents.getCalEvents(function(calEvents) {
  //console.log("useCreateCalWithEvents.js : calEvents: ", calEvents);
});


/*
calWithEvents.getEvents(2016, "Mar", function(events) {
  console.log('useCreateCalWithEvents.js: events: ', events);
});
*/

//calWithEvents.getAllData();
