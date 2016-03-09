var express = require('express');
var router  = express.Router();
var configFile = require('../../geeksWeatherConfiguraton');
var config = configFile.config;
var DELAY;
var logger;


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

router.get('/Calendar', function(req, res) {
  logger.trace('router.get(/Calendar) entry');
  logger.trace("__dirname: " + __dirname);
  res.sendFile(__dirname + '/Calendar.html');
  logger.trace('router.get(/Calendar) exit');
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
