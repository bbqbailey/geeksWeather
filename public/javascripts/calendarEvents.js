const MEETING='Meeting';
const WEDDING_ANNIVERSARY='Wedding Anniversary';
const FAMILY_GATHERING='Family Gathering';
const BIRTHDAY='Birthday';
const HAM_FIELDDAY="HAM Field Day";
const HOLIDAY="Holiday";
const EVENT='Event';

var eventTypes = [MEETING, WEDDING_ANNIVERSARY, FAMILY_GATHERING, BIRTHDAY, HAM_FIELDDAY, HOLIDAY, EVENT];

function getEvents() {
  console.log("calendar.js getEvents() entry");

  var calEvents={ 'month':[
    {'name':'Jan','events':[
    ]},
    {'name':'Feb','events':[
    ]},
    {'name':'March','events':[
      {'date':6,'event':WEDDING_ANNIVERSARY,'text':'Sarah and Michael\'s Wedding Anniversary'},
      {'date':12,'event':FAMILY_GATHERING,'text':'Sarah, Michael, Vickie join us for dinner.'},
      {'date':15,'event':MEETING,'text':' 7:30PM: NFARL Club Meeting'},
      {'date':20,'event':EVENT,'text':' Vernal Equinox 2016'},
      {'date':26,'event':BIRTHDAY,'text':'Scott Bagwell\'s Birthday'}
    ]},
    {'name':'April','events':[
      {'date':19,'event':BIRTHDAY,'text':'Sarah\'s Birthday'},
      {'date':19,'event':MEETING,'text':' 7:30PM: NFARL Club Meeting'}
    ]},
    {'name':'May','events':[
      {'date':17,'event':MEETING,'text':' 7:30PM: NFARL Club Meeting'}
    ]},
    {'name':'June','events':[
      {'date':20,'event':EVENT,'text':' Summer Soltice 2016'},
      {'date':21,'event':MEETING,'text':' 7:30PM: NFARL Club Meeting'},
      {'date':25,'event':HAM_FIELDDAY,'text':'  1800 UTC Start All Day: NFARL Club HAM Field Day'},
      {'date':26,'event':HAM_FIELDDAY,'text':' All Day 2059UTC End: NFARL Club HAM Field Day'}
    ]},
    {'name':'July','events':[
      {'date':4,'event':HOLIDAY,'text':'July 4th'},
      {'date':19,'event':MEETING,'text':' 7:30PM: NFARL Club Meeting'}
    ]},
    {'name':'August','events':[
      {'date':16,'event':MEETING,'text':' 7:30PM: NFARL Club Meeting'}
    ]},
    {'name':'September','events':[
      {'date':20,'event':MEETING,'text':' 7:30PM: NFARL Club Meeting'},
      {'date':22,'event':EVENT,'text':' Autumnal Equinox 2016'}
    ]},
    {'name':'October','events':[
      {'date':8,'event':BIRTHDAY,'text':'Pat\'s Birthday'},
      {'date':18,'event':MEETING,'text':' 7:30PM: NFARL Club Meeting'}
    ]},
    {'name':'November','events':[
      {'date':15,'event':MEETING,'text':' 7:30PM: NFARL Club Meeting'},
      {'date':16,'event':BIRTHDAY,'text':'Bengy\'s Birthday'},
      {'date':24,'event':HOLIDAY,'text':'Thanksgiving'}

    ]},
    {'name':'December','events':[
      {'date':11,'event':BIRTHDAY,'text':'Vickie\'s Birthday'},
      {'date':11,'event':BIRTHDAY,'text':'Caroline\'s Birthday'},
      {'date':21,'event':EVENT,'text':' Winter Soltice 2016'},
      {'date':25,'event':HOLIDAY,'text':'Christmas'}
    ]},


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
    var month = calEvents.month[i].name;
    var theEvent = calEvents.month[i].events[j].event;
    var date = calEvents.month[i].events[j].date;
    var text = calEvents.month[i].events[j].text;
    if(todayDate <= eventDate && i == todayMonth) {
      eventString = eventString + ' ' + month + ' ' + eventDate + ': ' + theEvent + ': ' + text + ' <br><br>';
    } else if(i==nextMonth) {
      eventString = eventString + ' ' + month + ' ' + eventDate + ': ' + theEvent + ': ' + text + ' <br><br>';
    }
  }
  if(i==todayMonth)
    eventString = eventString + "<hr>"
  console.log('eventString: ' + eventString);
  $("#event").html(eventString);
}

console.log("calendar.js getEvents() exit");
