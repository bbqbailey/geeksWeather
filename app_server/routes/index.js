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

router.get('/localForecast', function(req, res) {
    logger.trace('router.get(/localForecast) entry');
    res.render('localForecast', {'DELAY':DELAY, name:'Banjo'});
    logger.trace('router.get(/localForecast) exit');
});

router.get('/geeksWeatherDoc', function(req, res) {
  logger.trace('router.get(/geeksWeatherDoc) entry');
  res.render('geeksWeatherDoc');
  logger.trace('router.get(/geeksWeatherDoc) exit');
});
