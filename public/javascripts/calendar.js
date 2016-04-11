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

//var rootPath =require("geeksweatherconfig").rootPath;
//var CreateCalWithEvents = require(rootPath + "public/javascripts/CreateCalWithEvents");

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
  Birthday:'border-top:10px solid #ff0000;',
  Appointment:'border-right:10px solid #00ff00;',
  Holiday:'border-bottom:10px solid #0000ff;',
  Misc:'border-left:10px solid #909090;',
  Today:'color:red;',
  Trip:'background-color:green;'
  }

var date = new Date();
var theYear = date.getFullYear(); //e.g., 2014 instead of 14
var theMonth = date.getMonth(); //Jan is 0
var calEvents;
console.log("calendar.js entry");

//var calWithEvents = new CreateCalWithEvents(theYear, theMonth);
console.log('calendar.js typeof calWithEvents: ', typeof calWithEvents);
//console.log('calendar.js calWithEvents: ', calWithEvents);


buildHTML();


//console.log('calendar.js calling getCalEvents');
/*
calWithEvents.getCalEvents(function(err, calEvents) {
  if(err) {
    console.log('calendar.js getCalEvents callback: error: ', err);
  } else {
    console.log("calendar.js : getcalEvents callback: calEvents: ", calEvents);
    buildHTML();
  }
});
*/


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
          eventColors += EventType[shortDay[calDate].events[i].eventType] + " ";
          if((i+1) === shortDay[calDate].events.length)
            eventColors += '"'
          //console.log('Event: ' + shortDay[calDate].events[i].eventType);
        }
        todaysData += eventColors + ' > ' + calDate + ' </td>';
      }
    }
    console.log(todaysData);
    theCalendar += todaysData;
  }
  console.log('</tr>');
  console.log('</table>');
  console.log('</div>');
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
  console.log('colorKey: ' + colorKey);

  theCalendar += colorKey;


  $("#month").html(monthNames[theMonth]);
  $("#year").html(theYear);
  $("#monthYear").html(monthNames[theMonth] + " " + theYear);
  $("#date").html(theDate);
  $("#dayLong").html(dayNamesLong[theDay]);
  $("#dayShort").html(dayNamesShort[theDay]);
  $("#calendar").html(theCalendar);

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
