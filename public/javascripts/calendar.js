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

console.log("calendar.js entry");
var rootPath =require("geeksweatherconfig").rootPath;
var CreateCalWithEvents = require(rootPath + "public/javascripts/CreateCalWithEvents");

/*
var calEvents={ 'month':  {'name':'Mar','events':[
    {'date':6,'event':'WEDDING_ANNIVERSARY','text':'Sarah and Michael\'s Wedding Anniversary'},
    {'date':12,'event':'FAMILY_GATHERING','text':'Sarah, Michael, Vickie join us for dinner.'},
    {'date':15,'event':'MEETING','text':'NFARL Club Meeting 7:30PM'},
    {'date':26,'event':'BIRTHDAY','text':'Scott Bagwell\'S Birthday'},
  ]}
};
*/

var EventType={
  Birthday:'border-top:5px solid #ff0000;',
  Appointment:'border-right:5px solid #00ff00;',
  Holiday:'border-bottom:5px solid #0000ff;',
  Misc:'border-left:5px solid #c0c0c0;',
  Today:'color:red;',
  Trip:'background-color:green;'
  }

var date = new Date();
var theYear = date.getFullYear(); //e.g., 2014 instead of 14
var theMonth = date.getMonth(); //Jan is 0
var calEvents;

var calWithEvents = new CreateCalWithEvents(theYear, theMonth);
console.log('calendar.js return from CreateCalWithEvents constructor');

console.log('calendar.js calling getCalEvents');
calWithEvents.getCalEvents(function(err, calEvents) {
  if(err) {
    console.log('calendar.js getCalEvents callback: error: ', err);
  } else {
    console.log("calendar.js : getcalEvents callback: calEvents: ", calEvents);
    buildHTML();
  }
});


//build the html
function buildHTML() {
  var month = new Array();
  var monthNames = ["January","February","March","April","May","June",
    "July","August","September","October","November","December"];
  var dayNamesShort = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri","Sat"];
  var dayNamesLong  = ["Sunday","Monday", "Tueday", "Wedday", "Thuday", "Friday","Satday"];
  //var date = new Date();
  //var theYear = date.getFullYear(); //e.g., 2014 instead of 14
  //var theMonth = date.getMonth(); //Jan is 0
  var theDate = date.getDate();
  var theDay = date.getDay();

  console.log("calendar.js produceHTML() entry");
  //createCal(month);

  console.log("calendar.js calWithEvents: ", calWithEvents);

  var theCalendar = "<style> table { font-size:60px; font-weight: bold} #today {border-width:10px; border-style: solid; border-color: red} </style>";
  theCalendar = theCalendar + ("<table>");
  theCalendar = theCalendar + ("  <tr>");
  theCalendar = theCalendar + ("    <th> Sun </th>" );
  theCalendar = theCalendar + ("    <th> Mon </th>" );
  theCalendar = theCalendar + ("    <th> Tue </th>" );
  theCalendar = theCalendar + ("    <th> Wed </th>" );
  theCalendar = theCalendar + ("    <th> Thu </th>" );
  theCalendar = theCalendar + ("    <th> Fri </th>" );
  theCalendar = theCalendar + ("    <th> Sat </th>" );
  theCalendar = theCalendar + ("  </tr>")

  var calendarCell;
  console.log('================================calendarCell=======================');
  var shortCal = calWithEvents.calendarMonth.byCal; //convenience
  var shortDay = calWithEvents.calendarMonth.byDay;
  var firstTime = true;
  console.log('<table>');
  for(calendarCell=0; calendarCell<shortCal.length; calendarCell++) {
    if(calendarCell%7 === 0) {
      if(!firstTime) {
        console.log('</tr>');
      }
      firstTime=false;

      console.log('<tr>');
    }
    //console.log('byCal[' + calendarCell + ']: ', calWithEvents.calendarMonth.byCal[calendarCell]);
    //console.log('cell: ' + calendarCell + ', date: ' + shortcut[calendarCell].date);
    var calDate = shortCal[calendarCell].date
    var todaysData = '<td> ' + calDate + ' </td>';
    if(calDate === undefined) {
      todaysData = "<td> </td>";
    } else {
      if( calDate === theDate) {
        todaysData = '<td id="today" > ' + calDate + ' </td>'
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
            eventColors += 'style="';
          eventColors += EventType[shortDay[calDate].events[i].eventType] + " ";
          if((i+1) === shortDay[calDate].events.length)
            eventColors += '"'
          //console.log('Event: ' + shortDay[calDate].events[i].eventType);
        }
        todaysData += eventColors + ' > ' + calDate + ' </td>';
      }
    }
    console.log(todaysData);
  }
  console.log('</tr>');
  console.log('</table>');
}


  /* old but works, prior to using single array of byCal
  for(i=0; i<=5; i++) { //max rows for any month is 6
    theCalendar = theCalendar + ("  <tr>");
    for(j=0;j<=6; j++) { //max days for any week is 7
      var dateString = "";
      var id = "";
      var monthDate = month[i][j];  //we are working on this date of the month
      console.log('calEvents length: ' + calEvents.month.events.length);
      if(monthDate == theDate) {
        console.log('monthDate == theDate: true');
        id= " id='today' ";
      }
      for(k=0;k<calEvents.month.events.length;k++) {
        //some convenience abbreviations
        var eventDate = calEvents.month.events[k].date;
        console.log('===========theDate: ' + theDate + ' monthDate: ' + monthDate + ' eventDate: ' + eventDate);
        var bgColor = "";
        if(monthDate==eventDate) {
          console.log('monthDate == eventDate: true');
          bgColor = " bgcolor=#00ff00 "
          break;
        }
      }
      dateString = "<td " + id + bgColor + "> " + monthDate + "</td>";
      console.log('dateString: ' + dateString);
      theCalendar = theCalendar + dateString;
    }
    theCalendar = theCalendar + ("  </tr>")
    if(('' === month[i][6]) || ('' === month[i+1][0])) {  //in case Sat is last day then look at Sun
      theCalendar = theCalendar + ("</table>");
      break;
    }
  }
  console.log("theCalendar: " + theCalendar);
  console.log("Year: " + theYear + " Month: " + monthNames[theMonth] + " Date: " + theDate);
  console.log("Day Long: " + dayNamesLong[theDay] + " Day Short: " + dayNamesShort[theDay]);
  $("#month").html(monthNames[theMonth]);
  $("#year").html(theYear);
  $("#monthYear").html(monthNames[theMonth] + " " + theYear);
  $("#date").html(theDate);
  $("#dayLong").html(dayNamesLong[theDay]);
  $("#dayShort").html(dayNamesShort[theDay]);
  $("#calendar").html(theCalendar);
  console.log("calendar.js produceHTML() exit");
}

//create the calendar
/*
function createCal(month) {
  console.log("calendar.js createCal() entry");
  var searching=true;
  var dayCounter=1;
  var day = new Date(); //careful: changes date below via setDate
  day.setDate(1);  //sets Date object to first day of month
  var firstDay = day.getDay();
  var lastDate = new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate();
  for(i=0; i<=5; i++) {  //weeks in month
    month[i] = new Array();
    for(j=0; j<=6; j++) { //days in week
      if(searching) {
        if(j==firstDay) {
          month[i][j]=dayCounter++;
          searching=false;
        } else {
          month[i][j]='';
        }
      } else {
        month[i][j]=dayCounter;
        if(dayCounter > lastDate)
          month[i][j]='';
        dayCounter++;
      }
    }
  }
  console.log("calendar.js createCal() exit");
}
*/
