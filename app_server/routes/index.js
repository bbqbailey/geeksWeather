var express = require('express');
var router = express.Router();

var DELAY;
var logger;

//module.exports = router;

module.exports = function(theDelay, theLogger) {
  DELAY = theDelay;
  logger = theLogger;
  return router;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    logger.trace('router.get(/) entry');
    res.render('loopingPages', {'DELAY':DELAY, name:'Banjo'});
    logger.trace('router.get(/) exit');
});

router.get('/detailedInfo', function(req, res, next) {
    logger.trace('router.get(/detailedInfo) entry');
    res.render('detailedInfo');
    logger.trace('router.get(/detailedInfo) exit');
});

router.get('/loopingPages', function(req, res, next) {
    logger.trace('router.get(/loopingPages) entry');
    res.render('loopingPages', {'DELAY':DELAY, name:'Banjo'});
    logger.trace('router.get(/loopingPages) exit');
});

router.get('/timeAndWeather', function(req, res, next) {
    logger.trace('router.get(/timeAndWeather) entry');
    res.render('timeAndWeather', {'DELAY':DELAY, name:'Banjo'});
    logger.trace('router.get(/timeAndWeather) exit');
});
