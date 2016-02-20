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

router.get('/atlantaRadar', function(req, res, next) {
    logger.trace('router.get(/atlantaRadar) entry');
    res.render('atlantaRadar');
    logger.trace('router.get(/atlantaRadar) exit');
});

router.get('/conusForecastMap', function(req, res, next) {
    logger.trace('router.get(/conusForecastMap) entry');
    res.render('conusForecastMap');
    logger.trace('router.get(/conusForecastMap) exit');
});

router.get('/conusSatellite', function(req, res, next) {
    logger.trace('router.get(/conusSatellite) entry');
    res.render('conusSatellite');
    logger.trace('router.get(/conusSatellite) exit');
});

router.get('/detailedInfo', function(req, res, next) {
    logger.trace('router.get(/detailedInfo) entry');
    res.render('detailedInfo');
    logger.trace('router.get(/detailedInfo) exit');
});

router.get('/localForecast', function(req, res, next) {
    logger.trace('router.get(/localForecast) entry');
    res.render('localForecast');
    logger.trace('router.get(/localForecast) exit');
});

router.get('/southernMissRadar', function(req, res, next) {
    logger.trace('router.get(/southernMissRadar');
    res.sendFile('southernMissRadar.html', {root: path.join(__dirname, 'public/images') });
    logger.trace('router.get(/southernMissRadar');
});

router.get('/timeAndConus', function(req, res, next) {
    logger.trace('router.get(/timeAndConus');
    res.render('timeAndConus', {root: path.join(__dirname, 'public/images') });
    logger.trace('router.get(/timeAndConus');
});

router.get('/timeAndRadar', function(req, res, next) {
    logger.trace('router.get(/timeAndRadar) entry');
    res.render('timeAndRadar');
    logger.trace('router.get(/timeAndRadar) exit');
});

router.get('/timeAndWeather', function(req, res, next) {
    logger.trace('router.get(/timeAndWeather) entry');
    res.render('timeAndWeather');
    logger.trace('router.get(/timeAndWeather) exit');
});

router.get('/weatherGov', function(req, res, next) {
    logger.trace('router.get(/weatherGov) entry');
    res.render('weatherGov');
    logger.trace('router.get(/weatherGov) exit');
});

router.get('/weatherNews', function(req, res, next) {
    logger.trace('router.get(/weatherNews) entry');
    res.render('weatherNews');
    logger.trace('router.get(/weatherNews) exit');
});

router.get('/loopingPages', function(req, res, next) {
    logger.trace('router.get(/loopingPages) entry');
    res.render('loopingPages', {'DELAY':DELAY, name:'Banjo'});
    logger.trace('router.get(/loopingPages) exit');
});
