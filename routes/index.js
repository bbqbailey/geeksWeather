var express = require('express');
var router  = express.Router();
var configFile = require('../geeksWeatherAppData');
var rootPath = require('geeksweatherconfig').rootPath;
var Calendar = require(rootPath + 'public/javascripts/Calendar');
var CreateCalWithEvents = require(rootPath + "public/javascripts/CreateCalWithEvents");
var CalendarEvents = require(rootPath + "public/javascripts/CalendarEvents");
var Datastore = require("nedb");
//global; was running into issues when doing new Datastore twice
db = new Datastore({filename: rootPath + "public/database/calEvents.db", autoload: true});

var config = configFile.config;
var DELAY;
var logger;

var EventType={
  Birthday:'border-top:20px solid #ff0000;',
  Appointment:'border-right:20px solid #00ff00;',
  Holiday:'border-bottom:20px solid #0000ff;',
  Misc:'border-left:20px solid #909090;',
  Today:'color:red;',
  Trip:'background-color:green;'
  }



//console.log("====================================index.js config is typeof : ", typeof config);
//console.log("config: ", config);
var stringifyconfig = JSON.stringify(config)

module.exports = function(theDelay, theLogger) {
  DELAY = theDelay;
  logger = theLogger;
  return router;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    logger.trace('router.get(/) entry');
    res.render('slideShow', {'DELAY':DELAY, name:'Banjo', 'config': stringifyconfig});
    logger.trace('router.get(/) exit');
});

router.get('/slideShow', function(req, res, next) {
    logger.trace('router.get(/) entry');
    res.render('slideShow', {'DELAY':DELAY, name:'Banjo', 'config': stringifyconfig});
    logger.trace('router.get(/) exit');
});

router.get('/detailedInfo', function(req, res, next) {
    logger.trace('router.get(/detailedInfo) entry');
    res.render('detailedInfo');
    logger.trace('router.get(/detailedInfo) exit');
});

router.get('/localForecastDays1', function(req, res) {
    logger.trace('router.get(/localForecastDays1) entry');
    res.render('localForecastDays1', {'DELAY':DELAY, name:'Banjo'});
    logger.trace('router.get(/localForecastDays1) exit');
});

router.get('/localForecastDays2', function(req, res) {
    logger.trace('router.get(/localForecastDays2) entry');
    res.render('localForecastDays2', {'DELAY':DELAY, name:'Banjo'});
    logger.trace('router.get(/localForecastDays2) exit');
});

router.get('/geeksWeatherDoc', function(req, res) {
  logger.trace('router.get(/geeksWeatherDoc) entry');
  res.render('geeksWeatherDoc');
  logger.trace('router.get(/geeksWeatherDoc) exit');
});

router.get('/calendar', function(req, res) {
  logger.trace('router.get(/calendar) entry');
  createCal(function(err, stringifyCalWithEvents) { //local function
    if(err) {
      console.log('====ERROR====index.js router.get(/calendar) err: ', err);
    } else {
      //console.log('router.get rendering: ', stringifyCalWithEvents);
      //res.render('calendar', { 'calWithEvents': stringifyCalWithEvents});
      res.send(stringifyCalWithEvents);
      console.log('index.js router.get(/calendar): do I want res.send or res.render (requires .jade ) ???');
    };
  });
  logger.trace('router.get(/calendar) exit');
});

router.get('/calendarEvents', function(req, res) {
  logger.trace('router.get(/calendarEvents) entry');

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();

  var calendarEvents = new CalendarEvents(year, month);
  calendarEvents.getEvents(function(err, calEvents) {
    if(err) {
      console.log('===ERROR===index.js router.get(/calendarEvents) err: ', err);
    } else {
      console.log('index.js router.get(/calendarEvents) calevents: ', calEvents);
      res.send(calEvents);
    }
  });
  logger.trace('router.get(/calendar) exit');
});

router.get('/camera1', function(req, res) {
  logger.trace('router.get(/camera1) entry');
  var camera1uri = config.cameras.camera1.uri;
  res.render('camera1', {'camera1uri':camera1uri});
  logger.trace('router.get(/camera1) exit');
});

router.get('/testBoxes', function(req, res) {
  logger.trace('router.get(/testBoxes) entry');
  res.render('testBoxes');
  logger.trace('router.get(/testBoxes) exit');
});

router.post('/eventEditor'), function(req, res) {
  logger.trace('router.post(/eventEditor) entry');
  res.render('eventEditor');
  logger.trace('router.get(/eventEditor) exit');
}

function createCal(callback) {
  buildCalendar(function(err, calWithEvents) {
    //console.log('index.js createCal(): return from buildCalendar calWithEvents: ', calWithEvents);
    if(err) {
      console.log('=========ERROR==========index.js createCal() buildCalendar() err: ', err);
      callback(err, null);
    } else {
      //console.log('index.js createCal() buildCalendar() calWithEvents: ', calWithEvents);
      //console.log('index.js createCal() buildCalendar() returning via callback');
      callback(null, calWithEvents);
    };
  });
};

function buildCalendar(callback) {
  var date = new Date();
  var fullYear = date.getFullYear();
  var month = date.getMonth();
  var calWE = new CreateCalWithEvents(fullYear, month);
  var calWithEvents;
  calWE.getCalEvents(function(err, calEvents) {
    var calendar = new Calendar();
    calendar.buildHTML(EventType, calWE.calendarMonth, function(err, stringifyCalWithEvents) {
      //console.log('=====index.js buildCalendar() in callback after return from calendar.buildHTML()====');
      if(err) {
        console.log('========ERROR==========index.js buildCalendar(): calendar.buildHTML() error: ', err);
        callback(err, null);
      } else {
        //console.log('index.js buildCalendar(): calendar.buildHTML()', stringifyCalWithEvents);
        //console.log('index.js buildCalendar() exiting via callback after completing calendar.buildHTML()');
        callback(null, stringifyCalWithEvents);
      }
    });
  });
}
