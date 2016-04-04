/**
* CreateCal
*
* Description:
* Facilitates creation of a physical calendar with references to
* events, such as Birthdays, for the date.
*
* Creates and returns an object with two elements: byDays and byCal.
* It uses the javascript Date() method, so the same constraints that
* apply to Date() apply to CreateCal. E.g., Sunday = 0, Jan = 0;
* Events, such as 'Birthday' are associated with objects in byDay.
*
* returns:
* -byDays: - primary use case is to facilitate finding events for a given date.
* An array of objects of the form {"date":i, eventToday:false, events:[{}]}
*   'date':i - the date value for the month.
*   'eventToday':boolean - true if there are events for that date.
*   'events':[{}] - an array of CalendarEvent objects. Each object is an
*     calendar event that takes place on the date, such as 'Birthday' or
*     'Meeting'.
*
* -byCal: - primary use case is to facilitate creation of physical calendar.
* Each entry in the byCal calendar array is a single object of byDays element
* for that position on the calendar.  Contains a reference to a
* byDays:monthOfDays element.
*
* A physical calendar has carryover dates from the previous month, as well
* as dates associated with next month.  The index of the byDays element begins
* on Sunday, and ends on Saturday following the last day of the month being
* created.  Typically, Sunday is not the first day of each month, so index==0
* would be the last Sunday of last month.  E.g, for March 2016, the first day
* of the month is Tuesday (day==2).  So index==0, and index==1 are last month,
* and index==2 is the first day of March 2016, a Tuesday.  The entries for
* index==0 and index==1 is undefined, as they were last month.
* For March 2016, the month has 31 days, so the 31st is located in index==32,
* which is a Thursday.  That leaves Friday and Saturday for the physical
* calendar, index==33 and index==35.  There are 5 weeks in the physical
* calendar for March 2016, so there are 5 x 7, or 35 objects in the array.
*
* Example:
* March 20 2016 was the first day of Spring, and is on the 4th Sunday as
* it appears on a physical calendar (the first Suday was February 27).
* An CalendarEvent for March 20 would be inserted into byDays:monthOfDays[20]
* (Note: byDays:monthOfDays[0] is undefined.)
* From a physical calendar perspective, this is inserted into
* byCal:calendar[21].
* So phycisal calendar element 21 contains the events for March 20.
* This facilitates printing a calendar, so step through the byCal:calendar[x],
* and obtain the byDays:monthOfDays entry.
*
*
* @constructor
* @param {number} year - the year for the calendar to be created
* @param {number} month - The month (Jan is 0) for the calendar to be created
*
* @returns * an object of { byDays: monthOfDays, byCal: calendar }
* @param byDays
* @param byCal
**/

var calValues = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,
  Sep:8,Oct:9,Nov:10,Dec:11};


function CreateCal(year, month, callBack) {
  var day;

  if(isNaN(month)) {
    day = new Date(year, calValues[month]);
  } else {
    day = new Date(year, month);
  }

  console.log('CreateCal.js: day: ' + day);
  var calendar=[]; //will build up a 2 dim array, or array of arrays

  var searching=true;
  var dayCounter=1;
  day.setDate(1);  //sets Date object to first day of calendar
  var firstDay = day.getDay();
  var lastDate = new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate();
  var lastDay = new Date(day.getFullYear(), day.getMonth(), lastDate).getDay();

  var day ={};
  var monthOfDays = [{}];
  var i, j;

  monthOfDays[0]={};

  for(i=1;i<=lastDate;i++) {
      monthOfDays[i] = {"date":i, eventToday:false, events:[]};
  }

  for(i=0;i<firstDay;i++) {
    calendar[i]={};
  }

  for(i=firstDay, j=1;i<lastDate + firstDay;i++,j++) {
    calendar[i]=monthOfDays[j];
  }

  for(i=lastDate + firstDay, j= lastDay+1;j<7; i++, j++) {
    calendar[i]={};
  }

  var calendarMonth={byDay:monthOfDays,byCal:calendar};
  
  callBack(null, calendarMonth);
}

module.exports = CreateCal;
