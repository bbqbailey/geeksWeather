console.log("DELAY: ", DELAY);

if(DELAY == 'undefined') {
   console.log("loopingPages process.env.DELAY UNDEFINED");
   console.log("setting DELAY to 10000 microseconds");
   DELAY=10000;
} else {
   console.log("loopingPages process.env.DELAY is DEFINED and the value is: ", DELAY);
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
  'http://www.wpc.ncep.noaa.gov/noaa/noaad2.gif' //forecast tomorrow
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
];


function newSite() {
  document.getElementById('myImage').src = sites[i];
  //document.getElementById('pageHeader').innerHTML= titles[i];
  console.log("button advance; image: ", sites[i]);
  console.log("button advance; pageInfo: ", titles[i]);
  i++;
  if(i==sites.length)
    i=0;
};

setInterval(function() {
  advanceImage();
}, DELAY);

function advanceImage() {
  document.getElementById('myImage').src = sites[i];
  //document.getElementById('pageHeader').innerHTML=titles[i];
  i++;
  if(i==sites.length)
    i=0;
  console.log("setInterval() advance; image: ", sites[i]);
  //console.log("setInterval() advance; pageInfo: ", titles[i]);
}
