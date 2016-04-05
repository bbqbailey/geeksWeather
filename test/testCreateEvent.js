//var assert = require('assert');
var expect = require('chai').expect;
var sinon = require('mocha-sinon');

var rootPath = require("geeksweatherconfig").rootPath;
var CalendarEvent = require(rootPath + '/public/javascripts/CalendarEvent.js');

var assert = expect.assert;

describe('CalendarEvent - events for Calendar', function() {
  //eventYear, eventMonth, eventDate, eventTime, eventType, eventText
  var eventYear = "";
  var eventMonth = "April";
  var eventDate = 19;
  var eventTime = "7:00 PM";
  var eventType = "Birthday";
  var eventText = "Sarah's Birthday";


  describe('Verify correct creation of event and capture of values.', function() {
    it('Creates the Event Object with supplied data', function() {
      var event = new CalendarEvent(eventYear, eventMonth,eventDate,eventTime,eventType,eventText);

      expect(event.eventYear).to.equal(eventYear);
      expect(event.eventMonth).to.equal(eventMonth);
      expect(event.eventDate).to.equal(eventDate);
      expect(event.eventTime).to.equal(eventTime);
      expect(event.eventType).to.equal(eventType);
      expect(event.eventText).to.equal(eventText);
    });
  });

  describe("Verify the object method showEvent", function() {
    var event = new CalendarEvent(eventYear, eventMonth,eventDate,eventTime,eventType,eventText);
    it('object get methods should return attribute values', function() {
      expect(event.getEventYear()).to.equal(eventYear);
      expect(event.getEventMonth()).to.equal(eventMonth);
      expect(event.getEventDate()).to.equal(eventDate);
      expect(event.getEventTime()).to.equal(eventTime);
      expect(event.getEventType()).to.equal(eventType);
      expect(event.getEventText()).to.equal(eventText);
    });
  });
});
