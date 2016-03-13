const MEETING='Meeting';
const WEDDING_ANNIVERSARY='Wedding Anniversary';
const FAMILY_GATHERING='Family Gathering';
const BIRTHDAY='Birthday';

var eventTypes = [MEETING, WEDDING_ANNIVERSARY, FAMILY_GATHERING, BIRTHDAY];

function getEvents() {
  console.log("calendar.js getEvents() entry");

  var calEvents={ 'month':[
    {'name':'Jan','events':[]},
    {'name':'Feb','events':[]},
    {'name':'Mar','events':[
      {'date':6,'event':'WEDDING_ANNIVERSARY','text':'Sarah and Michael\'s Wedding Anniversary'},
      {'date':12,'event':'FAMILY_GATHERING','text':'Sarah, Michael, Vickie join us for dinner.'},
      {'date':15,'event':'MEETING','text':'NFARL Club Meeting 7:30PM'},
      {'date':26,'event':'BIRTHDAY','text':'Scott Bagwell\'s Birthday'},
    ]},
    {'name':'Apr','events':[
      {'date':19,'event':'BIRTHDAY','text':'Sarah\'s Birthday'},
    ]}
  ]};
  return calEvents;
}

var calEvents = getEvents();
var date = new Date();
var todayDate = date.getDate();
var todayMonth = date.getMonth();
console.log('calEvents: ', calEvents);
console.log('calEvents.month:', calEvents.month);
console.log('calEvents.month.events:', calEvents.month.events);
var theEvent=""
var eventString = "<section style='font-weight:bold; font-size:50px '>";
var nextMonth = (todayMonth + 1) % 12;
for(i=todayMonth;i<=nextMonth; i++) { //this month and next month
  console.log('calEvents.month[' + i + ']:', calEvents.month[i]);
  console.log('calEvents.month[' + i + '].events.length: ' + calEvents.month[i].events.length);
  for(j=0;j<calEvents.month[i].events.length; j++) {
    var eventDate = calEvents.month[i].events[j].date;
    if(todayDate <= eventDate && i == todayMonth) {
      var month = calEvents.month[i].name;
      var theEvent = calEvents.month[i].events[j].event;
      var date = calEvents.month[i].events[j].date;
      var text = calEvents.month[i].events[j].text;
      eventString = eventString + ' March ' + eventDate + ': ' + theEvent + ': ' + text + ' <br><br>';
    } else if(i==nextMonth) {
      var month = calEvents.month[i].name;
      var theEvent = calEvents.month[i].events[j].event;
      var date = calEvents.month[i].events[j].date;
      var text = calEvents.month[i].events[j].text;
      eventString = eventString + ' March ' + eventDate + ': ' + theEvent + ': ' + text + ' <br><br>';
    }
  }
  if(i==todayMonth)
    eventString = eventString + "<hr>"
  console.log('eventString: ' + eventString);
  $("#event").html(eventString);
}

console.log("calendar.js getEvents() exit");
