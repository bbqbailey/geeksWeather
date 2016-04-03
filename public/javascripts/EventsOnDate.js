//constructor
function EventsOnDate(eventYear, eventMonth, eventDate) {
  this.eventYear = eventYear;
  this.eventMonth = eventMonth;
  this.eventDate = eventDate;
  this.eventToday = false;
  this.eventArray = [];
}

EventsOnDate.prototype.getEventYear = function() {
  return(this.eventYear);
}

EventsOnDate.prototype.getEventMonth = function() {
  return(this.eventMonth);
}

EventsOnDate.prototype.getEventDate = function() {
  return(this.eventDate);
}

EventsOnDate.prototype.getEventToday = function() {
  return(this.eventToday);
}

EventsOnDate.prototype.getEventArray = function() {
  return(this.eventArray);
}

EventsOnDate.prototype.isNotDuplicate = function(anEvent) {
  try {
    this.findEvent(anEvent);
    return false;
  } catch(err) {
    return true;
  }
}

EventsOnDate.prototype.addEvent = function(anEvent) {
  //ensure not duplicate
  if(this.isNotDuplicate(anEvent)) {
    this.eventArray.push(anEvent);
    this.eventToday = true;
  } else {
    throw "AttemptToCreateDuplicateEventEntry";
  }
}

EventsOnDate.prototype.removeEvent = function(anEvent) {
  var elemIndex;
  try {
    elemIndex = this.findEventIndex(anEvent);
  } catch(err) {
    throw "UnableToRemoveEvent: " + err;
  }
  this.eventArray.splice(elemIndex,1);
  if(this.eventArray.length === 0)
    this.eventToday = false;
}

EventsOnDate.prototype.pop = function() {
  this.eventArray.pop();  //wrap so we can set eventToday to false on empty
  if(this.eventArray.length === 0)
    this.eventToday = false;
}


//actually replaces event with new event
EventsOnDate.prototype.replaceEvent = function(anEvent, newEvent) {
  var elemIndex;
  try {
    elemIndex = this.findEventIndex(anEvent);
    this.eventArray[elemIndex] = newEvent;
  } catch(err) {
    throw "FailedToReplaceEvent: " + err;
  }
}

EventsOnDate.prototype.findEvent = function(anEvent) {
  try {
    var index = this.findEventIndex(anEvent);
    return(this.eventArray[index]);
  } catch(err) {
    throw(err);
  }
}


EventsOnDate.prototype.findEventIndex = function(anEvent) {
  var i;
  var theEvent;
  for(i=0;i<this.eventArray.length;i++) {
    theEvent = this.eventArray[i];
    if(theEvent === anEvent)  //are they the same object?  Not likely
      return i;
    if(theEvent.eventYear === anEvent.eventYear) {
      if(theEvent.eventMonth === anEvent.eventMonth) {
        if(theEvent.eventDate === anEvent.eventDate) {
          if(theEvent.eventTime === anEvent.eventTime) {
            if(theEvent.eventType === anEvent.eventType) {
              if(theEvent.eventText === anEvent.eventText) {
                return i;
              }
            }
          }
        }
      }
    }
  }
  throw "EventNotFound"
}

EventsOnDate.prototype.showEvents = function() {
  var i;
  console.log('Showing ' + this.eventArray.length + " events.");
  for (i=0; i<this.eventArray.length; i++) {
    this.eventArray[i].showEvent();
  }
}

module.exports = EventsOnDate;
