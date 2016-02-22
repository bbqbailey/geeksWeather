
console.log("++++++++++++++ FINAL: theName should be Banjo +++++++++++++++++++");
console.log("In loopingPages.js theName is " + theName);
console.log("In loopingPages.js DELAY is " + DELAY);
console.log("Is Jim dead? " + HES_DEAD_JIM);
console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

var MinDelay=10000;
if(typeof DELAY === 'undefined') {
    console.log("ERROR: in loopingPages.js, DELAY is undefined.");
    console.log("   Verify DELAY is passed as paramater in geeksWeather.js to /loopingPages");
    console.log("   or within loopingPages.jade");
    console.log("SETTING DELAY to MinDelay of " + MinDelay);
    DELAY = MinDelay;
} else if(DELAY < MinDelay) {
    console.log("WARNING: in loopingPages.js, DELAY is set to a value less than MinDelay of " + MinDelay + " microseconds");
    console.log("   This could result in hammering the underlaying websites, so the value is being changed.");
    console.log("   Changing DELAY to MinDelay value of " + MinDelay + " microseconds.");
    DELAY=MinDelay;
} else {
   console.log("loopingPages DELAY is: " + DELAY);
}

var docHeight = document.body.clientHeight;
var docWidth  = document.body.clientWidth;

function iframeDidLoad() {
  alert('Done');
}

var i=0;
var sites = [
  'http://radar.weather.gov/Conus/RadarImg/latest.gif', //usa
  'http://radar.weather.gov/Conus/RadarImg/southmissvly.gif', //miss valley
  'http://radar.weather.gov/Conus/RadarImg/southeast.gif', //southeast
  'http://radar.weather.gov/lite/N0R/FFC_0.png', //atlanta
  'https://icons.wxug.com/data/640x480/2xus_severe.gif', //usa severe weather
  'https://icons.wxug.com/data/640x480/2xse_severe.gif', //s.e. severe weather
  'http://www.ssec.wisc.edu/data/us_comp/image7.jpg', //Satellite
  'http://www.wpc.ncep.noaa.gov/noaa/noaad1.gif', //forecast today
  'http://www.wpc.ncep.noaa.gov/noaa/noaad2.gif', //forecast tomorrow
  'http://www.ssd.noaa.gov/goes/east/watl/ft.jpg', //GOES-EAST Funktop
  'http://www.ssd.noaa.gov/goes/east/carb/ft.jpg', //GOES-EAST Carib Funktop
  'http://www.ssd.noaa.gov/goes/comp/nhem/rb.jpg', //GOES-COMPOSITE Rainbow IR Ch 4
  'http://www.ssd.noaa.gov/goes/comp/nhem/wv.jpg' //GOES-COMPSITE Water Vapor
];

var titles = [
  'Continental USA Radar',
  'Lower Mississippi Valley Sector Radar',
  'southeast Sector Radar',
  'Atlanta Area Radar',
  'USA Severe Weather',
  'southeast Severe Weather',
  'Continental USA Satellite',
  'Continental USA forecast - Today',
  'Continental USA forecast - Tomorrow',
  'GOES-EAST Funktop - Current',
  'GOES-EAST Carib Funktop',
  'GOES-COMPOSITE Rainbow IR Ch 4',
  'GOES-COMPOSITE Water Vapor'
];


function nextSite() {
  console.log("loopingPages.js: HES_DEAD_JIM: " + HES_DEAD_JIM);
  if(HES_DEAD_JIM) {
    document.getElementById('myImage').src='/images/hesDeadJim.jpg';
  } else {
    document.getElementById('myImage').src = sites[i];
    //document.getElementById('pageHeader').innerHTML= titles[i];
    console.log("button advance; image: ", sites[i]);
    console.log("button advance; pageInfo: ", titles[i]);
    i++;
    if(i==sites.length)
      i=0;
  }
};

setInterval(function() {
  advanceImage();
}, DELAY);

function advanceImage() {
  console.log("loopingPages.js: HES_DEAD_JIM: " + HES_DEAD_JIM);
  if(HES_DEAD_JIM) {
    document.getElementById('myImage').src='/images/hesDeadJim.jpg';
  } else {
    document.getElementById('myImage').src = sites[i];
    //document.getElementById('pageHeader').innerHTML=titles[i];
    i++;
    if(i==sites.length)
      i=0;
    console.log("setInterval() advance; image: ", sites[i]);
    //console.log("setInterval() advance; pageInfo: ", titles[i]);
  }
}
