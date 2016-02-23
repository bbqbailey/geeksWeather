var express = require('express');
var router = express.Router();

var DELAY;
var logger;
var DEFAULT_FILE;

//module.exports = router;

module.exports = function(theDelay, theDefaulFile, theLogger) {
  DEBUG = theDelay;
  DEFAULT_FILE = theDefaulFile;
  logger = theLogger;
  return router;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    logger.trace('router.get(/) entry - rendering DEFAULT_FILE');
    res.render(DEFAULT_FILE);
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
