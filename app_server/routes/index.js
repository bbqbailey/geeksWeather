var express = require('express');
var router  = express.Router();
var sites = require('../../sites')
var DELAY;
var logger;


//console.log("====================================index.js sites is typeof : ", typeof sites);
//console.log("sites: ", sites);
var stringifySites = JSON.stringify(sites)

module.exports = function(theDelay, theLogger) {
  DELAY = theDelay;
  logger = theLogger;
  return router;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    logger.trace('router.get(/) entry');
    res.render('loopingPages', {'DELAY':DELAY, name:'Banjo', 'sites': stringifySites});
    logger.trace('router.get(/) exit');
});

router.get('/detailedInfo', function(req, res, next) {
    logger.trace('router.get(/detailedInfo) entry');
    res.render('detailedInfo');
    logger.trace('router.get(/detailedInfo) exit');
});

router.get('/timeAndWeather', function(req, res, next) {
    logger.trace('router.get(/timeAndWeather) entry');
    res.render('timeAndWeather', {'DELAY':DELAY, name:'Banjo'});
    logger.trace('router.get(/timeAndWeather) exit');
});
