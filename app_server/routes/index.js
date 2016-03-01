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
    res.render('loopingPages', {'DELAY':DELAY, name:'Banjo', 'config': stringifyconfig});
    logger.trace('router.get(/) exit');
});

router.get('/detailedInfo', function(req, res, next) {
    logger.trace('router.get(/detailedInfo) entry');
    res.render('detailedInfo');
    logger.trace('router.get(/detailedInfo) exit');
});

router.get('/timeAndWeather', function(req, res) {
    logger.trace('router.get(/timeAndWeather) entry');
    res.render('timeAndWeather', {'DELAY':DELAY, name:'Banjo'});
    logger.trace('router.get(/timeAndWeather) exit');
});

router.get('/design', function(req, res) {
  logger.trace('router.get(/design) entry');
  res.render('design');
  logger.trace('router.get(/design) exit');
});
