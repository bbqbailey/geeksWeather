/**
* addEventsToCal.js
*
* Description
* Using createCal.js, places user defined event objects into the calendar
* for a specific date within the calendar month.  The CreateCal uses
* javascript Date() method, so those constraints are the same herein; month
* is zero (0) based for January, so 0 - 11 represents Jan through Dec.
*
* @constructor
* @param: {number} year
* @param: {number} month
**/

var CreateCalendar = require("./CreateCal");

function AddEventsToCal(year, month) {
  this.calendar = new CreateCalendar(year, month);
};

AddEventsToCal.prototype.insertEventsOnDate = function(eventsOnDate, date) {
  var theDate = this.calendar.byDay[date]; //convenience
  theDate.events.push(event);
  theDate.eventToday = true;
}

AddEventsToCal.prototype.replaceEventsOnDate = function(eventsOnDate, date) {
  var theDate = calendar.byDay[date]; //convenience
  theDate.events = eventsOnDate;
  theDate.eventToday = true;
}
