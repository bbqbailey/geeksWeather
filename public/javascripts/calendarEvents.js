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
      {'date':26,'event':'BIRTHDAY','text':'Scott Bagwell\'S Birthday'},
    ]}
  ]};
  return calEvents;
}

var calEvents = getEvents();
console.log('calEvents: ', calEvents);
console.log('calEvents.month:', calEvents.month);
console.log('calEvents.month.events:', calEvents.month.events);
var theEvent=""
var eventString = "<section style='font-weight:bold; font-size:70px '>"
for(i=0;i<calEvents.month.length; i++) {
  console.log('calEvents.month[' + i + ']:', calEvents.month[i]);
  console.log('calEvents.month[' + i + '].events.length: ' + calEvents.month[i].events.length);
  for(j=0;j<calEvents.month[i].events.length; j++) {
    var eventDate = calEvents.month[i].events[j].date;
    var month = calEvents.month[i].name;
    var theEvent = calEvents.month[i].events[j].event;
    var date = calEvents.month[i].events[j].date;
    var text = calEvents.month[i].events[j].text;
    eventString = eventString + ' March ' + eventDate + ': ' + theEvent + ': ' + text + ' <br><br>';
  }
  console.log('eventString: ' + eventString);
  $("#event").html(eventString);
}

console.log("calendar.js getEvents() exit");
