//constructor
function CalendarEvent(eventYear, eventMonth, eventDate, eventTime, eventType, eventText, eventID) {
  this.eventYear = eventYear;
  this.eventMonth = eventMonth;
  this.eventDate = eventDate;
  this.eventTime = eventTime;
  this.eventType = eventType;
  this.eventText = eventText;
  this.eventID = eventID;
}

CalendarEvent.prototype.showEvent = function() {
  console.log('this: ', this);
}

CalendarEvent.prototype.getEventYear = function() {
  return this.eventYear;
}

CalendarEvent.prototype.getEventMonth = function() {
  return this.eventMonth;
}

CalendarEvent.prototype.getEventDate = function() {
  return this.eventDate;
}

CalendarEvent.prototype.getEventTime = function() {
  return this.eventTime;
}

CalendarEvent.prototype.getEventType = function() {
  return this.eventType;
}

CalendarEvent.prototype.getEventText = function() {
  return this.eventText;
}

module.exports = CalendarEvent;
