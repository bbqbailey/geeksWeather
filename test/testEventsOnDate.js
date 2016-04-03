//var assert = require('assert');
var expect = require('chai').expect;
var sinon = require('mocha-sinon');

var assert = expect.assert;

var CalendarEvent = require("../public/javascripts/CalendarEvent")
var EventsOnDate = require("../public/javascripts/EventsOnDate")

var eventItemYear = "2016";
var eventItemMonth = "April";
var eventItemDate = 19;
var eventItem1Type = "Birthday";
var eventItem1Text = "Sarah's Birthday";
var eventItem1ID = 1;
var eventItem2Time = "7:00 PM";
var eventItem2Type = "Meeting";
var eventItem2Text = "NFARL Meeting";
var eventItem2ID = 2;

describe("EventsOnDate - confirm creation of EventsOnDate object", function() {
  var eventsOnDate = new EventsOnDate(eventItemYear, eventItemMonth,eventItemDate);
  it('Creates the EventsOnDate object with the supplied data.', function() {
    expect(eventsOnDate.getEventToday()).to.equal(false);
    expect(eventsOnDate.getEventYear()).to.equal(eventItemYear);
    expect(eventsOnDate.getEventMonth()).to.equal(eventItemMonth);
    expect(eventsOnDate.getEventDate()).to.equal(eventItemDate);
  });
});

describe("EventsOnDate - adding elements to object attribute eventArray", function() {
  var eventsOnDate = new EventsOnDate(eventItemYear, eventItemMonth,eventItemDate);
  var eventItem1 = new CalendarEvent(eventItemYear, eventItemMonth, eventItemDate, null, eventItem1Type, eventItem1Text,  eventItem1ID);
  var eventItem2 = new CalendarEvent(eventItemYear, eventItemMonth, eventItemDate, eventItem2Time, eventItem2Type,  eventItem2Text, eventItem2ID);
  eventsOnDate.addEvent(eventItem1);
  eventsOnDate.addEvent(eventItem2);
  it('Confirms ability to add two CalendarEvent objects to EventsOnDate.eventArray', function() {
    expect(eventsOnDate.getEventArray().length).to.equal(2);
  });
  it('Ability to find event', function() {
    expect(eventsOnDate.findEvent(eventItem1)).to.equal(eventItem1);
    expect(eventsOnDate.findEvent(eventItem1).getEventMonth()).to.equal(eventItem1.getEventMonth());
    expect(eventsOnDate.findEvent(eventItem2).getEventMonth()).to.equal(eventItem2.getEventMonth());
  });
  it('Removing items', function() {
    eventsOnDate.removeEvent(eventItem1);
    expect(eventsOnDate.getEventArray().length).to.equal(1);
    expect(function() { eventsOnDate.findEvent(eventItem1);
      }).to.throw("EventNotFound");
  });
  //add it back
  it('Fail on add duplicate', function() {
    eventsOnDate.addEvent(eventItem1); //add back the one removed above
    //test for dup
    expect(function() {eventsOnDate.addEvent(eventItem1);
    }).to.throw("AttemptToCreateDuplicateEventEntry");
  });

  it('Replace event', function() {
    var newEvent = new CalendarEvent("2016","November",16,null,"Birthday", "Bengy's Birthday", 3);
    eventsOnDate.replaceEvent(eventItem1, newEvent);
    //find the new event
    expect(eventsOnDate.findEvent(newEvent)).to.equal(newEvent);

    //should not find eventItem1 to replace because it was already modified to become newEvent
    expect(function() { eventsOnDate.replaceEvent(eventItem1, newEvent);
    }).to.throw("FailedToReplaceEvent");
    //not find the original event
    expect(function() { eventsOnDate.findEvent(eventItem1);
      }).to.throw("EventNotFound");
    expect(eventsOnDate.getEventArray().length).to.equal(2);
    expect(eventsOnDate.getEventToday()).to.equal(true);

    eventsOnDate.removeEvent(newEvent);
    expect(eventsOnDate.getEventArray().length).to.equal(1);
    expect(eventsOnDate.getEventToday()).to.equal(true);

    eventsOnDate.removeEvent(eventItem2);
    expect(eventsOnDate.getEventArray().length).to.equal(0);
    expect(eventsOnDate.getEventToday()).to.equal(false);
  });

});
