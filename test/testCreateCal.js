//var assert = require('assert');
var expect = require('chai').expect;
var sinon = require('mocha-sinon');

var assert = expect.assert;

var CreateCal = require("../public/javascripts/CreateCal")



describe("CreateCal.js unit test", function() {
  var calendarMonth = new CreateCal(2016, 1); //February 2016
  var FirstDate = 1;
  var LastDate=29; //Feb 29th 2016 is on Monday
  var Sunday = 0;
  var Monday = 1;
  it('Test the calendar for Feb 2016 is correct.', function() {
    expect(calendarMonth.byCal[Sunday].date).to.equal(undefined);
    expect(calendarMonth.byCal[Monday].date).to.equal(FirstDate);
    expect(calendarMonth.byCal[LastDate].date).to.equal(LastDate);
    expect(calendarMonth.byCal[LastDate+1].date).to.equal(undefined);

  });
});

describe("CreateCal.js unit test", function() {
  var calendarMonth = new CreateCal(2016, 2); //March 2016
  var FirstDate = 1;
  var LastDate=31; //March 31st 2016 is on THursday
  var Sunday = 0;
  var Monday = 1;
  var Tuesday = 2;
  it('Test the calendar for Mar 2016 is correct.', function() {
    expect(calendarMonth.byCal[Sunday].date).to.equal(undefined);
    expect(calendarMonth.byCal[Monday].date).to.equal(undefined);
    expect(calendarMonth.byCal[Tuesday].date).to.equal(FirstDate);
    expect(calendarMonth.byCal[LastDate+1].date).to.equal(LastDate);
    expect(calendarMonth.byCal[LastDate+2].date).to.equal(undefined);
  });
});
