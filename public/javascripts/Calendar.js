//output:output.log
/**
*
* calendar.js
*
*  Uses:
*   Date()
*   geeksweatherconfig
*   CreateCalWithEvents
*
* Purpose:
*   Constructs an HTML calendar with events for each day.
*   Each day has the following attributes:
*     - If calendar date is today, then date text is colored red, else black
*     - Each border element (top, right, bottom, left) are colored to reflect
*       an event-type (EventType) for that day.
*
* Description:
*   Invokes CreateCalWithEvents, receiving a calendar with events for each day (calEvents).
*   Using calEvents, constructs an HTML calendar.
*
*
*
**/


var self;

function Calendar() {
  //var month = new Array();
  //console.log("Calendar.js entry");
  self = this;
  self.monthNames = ["January","February","March","April","May","June",
    "July","August","September","October","November","December"];
  self.dayNamesShort = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri","Sat"];
  self.dayNamesLong  = ["Sunday","Monday", "Tueday", "Wedday", "Thuday", "Friday","Satday"];
  self.date = new Date();
  self.theYear = self.date.getFullYear(); //e.g., 2014 instead of 14
  self.theMonth = self.date.getMonth(); //Jan is 0
}

//build the html
Calendar.prototype.buildHTML = function(eventTypes, calWithEvents, callback) {
  //console.log('Calendar.js buildHTML() entry: data in: calWithEvents: ', calWithEvents);
  //console.log('Calendar.js buildHTML() end of data in\n\n');
  var calEvents;
  //console.log('Calendar.buildHTML() entry');
  //console.log('Calendar.buildHTML() eventTypes: ', eventTypes);
  //console.log('Calendar.buildHTML() calWithEvents: ', calWithEvents);
  var theDate = self.date.getDate();
  var theDay = self.date.getDay();
  //console.log("calendar.js produceHTML() entry");
  //createCal(month);

  var theCalendar = "<style> table { font-size:60px; font-weight: bold} #today {border-width:40px; border-style: solid; color:red} </style>";
  theCalendar +=  ('<div style = "float:left">');
  theCalendar +=  ('  <table>');
  theCalendar +=  ('    <tr>');
  theCalendar +=  ('      <th> Sun </th>' );
  theCalendar +=  ('      <th> Mon </th>' );
  theCalendar +=  ('      <th> Tue </th>' );
  theCalendar +=  ('      <th> Wed </th>' );
  theCalendar +=  ('      <th> Thu </th>' );
  theCalendar +=  ('      <th> Fri </th>' );
  theCalendar +=  ('      <th> Sat </th>' );
  theCalendar +=  ('    </tr>')

  var calendarCell;
  //console.log('================================calendarCell=======================');
  //console.log('calendar.js: calWithEvents.byDay: ', calWithEvents.byDay);
  //console.log('calendar.js: calWithEvents.byCal: ', calWithEvents.byCal);
  var shortCal = calWithEvents.byCal; //convenience
  var shortDay = calWithEvents.byDay;
  var firstTime = true;
  //theCalendar += '<div style="float:left">';
  //theCalendar += '<table>';
  for(calendarCell=0; calendarCell<shortCal.length; calendarCell++) {
    if(calendarCell%7 === 0) {
      if(!firstTime) {
        theCalendar += '</tr>';
      }
      firstTime=false;

      theCalendar += '<tr>';
    }
    //console.log('byCal[' + calendarCell + ']: ', calWithEvents.calendarMonth.byCal[calendarCell]);
    //console.log('cell: ' + calendarCell + ', date: ' + shortcut[calendarCell].date);
    var calDate = shortCal[calendarCell].date
    var todaysData = '<td style="border:2px solid #000000;"> ' + calDate + ' </td>';
    if(calDate === undefined) {
      todaysData = "<td> </td>";
    } else {
      if( calDate === theDate) {
        todaysData = '<td id="today" style="border:2px solid #000000;"> ' + calDate + ' </td>'
      }
      if(shortDay[calDate].eventToday) {
        if(calDate === theDate) {
          todaysData = '<td id="today" ';
        } else {
          todaysData = '<td ';
        }
        var eventColors="";
        for(i=0;i<shortDay[calDate].events.length; i++) {
          if(i===0)
            eventColors = 'style="border:2px solid #000000;';
          eventColors += eventTypes[shortDay[calDate].events[i].eventType] + " ";
          if((i+1) === shortDay[calDate].events.length)
            eventColors += '"'
          //console.log('Event: ' + shortDay[calDate].events[i].eventType);
        }
        todaysData += eventColors + ' > ' + calDate + ' </td>';
      }
    }
    //console.log(todaysData);
    theCalendar += todaysData;
  }
  //console.log('</tr>');
  //console.log('</table>');
  //console.log('</div>');
  theCalendar += '</tr></table></div>';

  //add the color-key
  var colorKey = '<div style="float:left;"\>\r\n' +
    ' <div style="background-color:#ff0000">\r\n' +
    '   <span> Birthday </span>\r\n' +
    ' </div>' +
    ' <div style="background-color:#00ff00">\r\n' +
    '  <span>Appointment </span>\r\n' +
    ' </div>\r\n' +
    ' <div style="background-color:#0000ff">\r\n' +
    '  <span> Holiday </span>\r\n' +
    ' </div>\r\n' +
    ' <div style="background-color:#c0c0c0">\r\n' +
    '  <span> Misc </span>\r\n' +
    ' </div>\r\n' +
    ' <div style="background-color:green">\r\n' +
    '  <span> Trip</span>\r\n' +
    ' </div>\r\n' +
    ' <div style="background-color:red">\r\n'+
    '  <span>Today</span>\r\n' +
    ' </div>\r\n' +
    '</div>\r\n'
    ;
  //console.log('colorKey: ' + colorKey);

  theCalendar += colorKey;
  //console.log('Calendar.js buildHTML(): theCalendar: \r\n' + theCalendar);
  //console.log('Calendar.js buildHTML() RETURN via CALLBACK');
  callback(null, theCalendar);

}

module.exports = Calendar;

/*
================THIS HAS TO BE REDONE NOW THAT MOVED INTO INDEX.JS =============
  $("#month").html(monthNames[theMonth]);
  $("#year").html(theYear);
  $("#monthYear").html(monthNames[theMonth] + " " + theYear);
  $("#date").html(theDate);
  $("#dayLong").html(dayNamesLong[theDay]);
  $("#dayShort").html(dayNamesShort[theDay]);
  $("#calendar").html(theCalendar);
*/
