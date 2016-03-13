//output:output.log
console.log("calendar.js entry");

var calEvents={ 'month':  {'name':'Mar','events':[
    {'date':6,'event':'WEDDING_ANNIVERSARY','text':'Sarah and Michael\'s Wedding Anniversary'},
    {'date':12,'event':'FAMILY_GATHERING','text':'Sarah, Michael, Vickie join us for dinner.'},
    {'date':15,'event':'MEETING','text':'NFARL Club Meeting 7:30PM'},
    {'date':26,'event':'BIRTHDAY','text':'Scott Bagwell\'S Birthday'},
  ]}
};

buildHTML();


//build the html
function buildHTML() {
  var month = new Array();
  var monthNames = ["January","February","March","April","May","June",
    "July","August","September","October","November","December"];
  var dayNamesShort = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri","Sat"];
  var dayNamesLong  = ["Sunday","Monday", "Tueday", "Wedday", "Thuday", "Friday","Satday"];
  var date = new Date();
  var theYear = date.getFullYear();
  var theMonth = date.getMonth();
  var theDate = date.getDate();
  var theDay = date.getDay();

  console.log("calendar.js produceHTML() entry");
  createCal(month);

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
  for(i=0; i<=5; i++) {
    theCalendar = theCalendar + ("  <tr>");
    for(j=0;j<=6; j++) {
      var dateString = "    <td> " + month[i][j] + " </td>";
      console.log('calEvents length: ' + calEvents.month.events.length);
      for(k=0;k<calEvents.month.events.length;k++) {
        console.log('comparing ' + month[i][j] + ' to ' + calEvents.month.events[k].date);
        if(theDate == month[i][j] ) {
          dateString = "    <td id='today' ";
          if(calEvents.month.events[k].date == month[i][j]) {
            dateString = dateString + " bgcolor=#00ff00";
          }
          dateString = dateString +  "> " + month[i][j] + " </td>";
        } else if(calEvents.month.events[k].date == month[i][j]) {
          dateString = "    <td bgcolor=#00ff00> " + month[i][j] + " </td>";
        }
      }
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
