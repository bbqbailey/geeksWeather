/*
console.log("++++++++++++++ FINAL: theName should be Banjo +++++++++++++++++++");
console.log("In loopingPages.js theName is " + theName);
console.log("In loopingPages.js DELAY is " + DELAY);
console.log("Is Jim dead? " + HES_DEAD_JIM);
console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
*/

var MinDelay=5000;
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

var sites = [
  'http://www.ssec.wisc.edu/data/us_comp/image7.jpg', //Satellite
  'http://radar.weather.gov/Conus/RadarImg/latest.gif', //usa
  'http://radar.weather.gov/Conus/RadarImg/southmissvly.gif', //miss valley
  'http://radar.weather.gov/Conus/RadarImg/southeast.gif', //southeast
  'http://radar.weather.gov/lite/N0R/FFC_0.png', //atlanta
  'https://icons.wxug.com/data/640x480/2xus_severe.gif', //usa severe weather
  'https://icons.wxug.com/data/640x480/2xse_severe.gif', //s.e. severe weather
  'http://www.wpc.ncep.noaa.gov/noaa/noaad1.gif', //forecast today
  'http://www.wpc.ncep.noaa.gov/noaa/noaad2.gif', //forecast tomorrow
  'http://www.ssd.noaa.gov/goes/comp/nhem/rb.jpg', //GOES-COMPOSITE Rainbow IR Ch 4
  'http://www.ssd.noaa.gov/goes/comp/nhem/wv.jpg' //GOES-COMPSITE Water Vapor
];

var titles = [
  'Continental USA Satellite',
  'Continental USA Radar',
  'Lower Mississippi Valley Sector Radar',
  'southeast Sector Radar',
  'Atlanta Area Radar',
  'USA Severe Weather',
  'southeast Severe Weather',
  'Continental USA forecast - Today',
  'Continental USA forecast - Tomorrow',
  'GOES-COMPOSITE Rainbow IR Ch 4',
  'GOES-COMPOSITE Water Vapor'
];

var iframePages = [
  '/timeAndWeather'
]


var i=0;
var j=0;

function nextSite() {  //used with button
  console.log("loopingPages.js nextSite(): HES_DEAD_JIM: " + HES_DEAD_JIM);
  if(HES_DEAD_JIM) {
    document.getElementById('imageDiv').innerHTML='<img src="/images/hesDeadJim.jpg">';

  } else {
    document.getElementById('imageDiv').innerHTML='<img src=' + sites[i] + '>';
    //document.getElementById('pageHeader').innerHTML= titles[i];
    console.log("button advance; image: ", sites[i]); //TESTING - SHOULD BE 'i' not '0'
    //console.log("button advance; pageInfo: ", titles[i]);
    i++;
    if(i==sites.length)
      i=0;
  }
};


var pauseCheckboxValue='';
function pauseChanged(element) { //used with checkbox
    console.log("loopingPages.js pauseChanged() entry");
    element.checked ? pauseCheckboxValue="Checked": pauseCheckboxValue="";
    console.log("pauseCheckboxValue: " + pauseCheckboxValue);
}

function moveToDetailedInfo() { //used with button
    console.log("loopingPages.js moveToDetailedInfo() entry");
    window.location.href="detailedInfo";
}

setInterval(function() {
  console.log("fired");
  advanceImage();
}, DELAY);

var display="iframeSite"; //valid are imgSite and iframeSite
var firstTime = true;
function advanceImage() { //used with setInterval
  console.log("loopingPages.js: HES_DEAD_JIM: " + HES_DEAD_JIM);
  if(HES_DEAD_JIM) {
    console.log("display is HES_DEAD_JIM");
    document.getElementById('imageDiv').innerHTML='<img src="/images/hesDeadJim.jpg">';
  } else if(pauseCheckboxValue==='Checked') {
      console.log("advanceImage(): pauseCheckboxValue === 'Checked'");
      console.log("returning without advancing");
      return;
  } else if(display==='imgSite') {
    console.log("inside display===imgSite");
    if(firstTime) {
      console.log("firstTime is true");
      //document.getElementById('imageDiv').innerHTML='<img src="/images/bbqBailey.jpg", height="80%", width="100%" >';
      firstTime=false;
    }
    document.getElementById('imageDiv').innerHTML='<img src=' + sites[i]+ ' height="980px" ></iframe>'
    //document.getElementById('myImage').src = sites[i];
    //document.getElementById('pageHeader').innerHTML=titles[i];
    i++;
    if(i==sites.length) {
      i=0;
      display="iframeSite"
    }
  } else if(display==='iframeSite') {
    console.log("inside display===iframeSite");
//    document.getElementById('imageDiv').innerHTML="<iframe src='http://localhost:8080/timeAndWeather' height='80%' width='80%'></iframe>"
    document.getElementById('imageDiv').innerHTML='<iframe src=' + iframePages[j] + ' height="980px" width="120%"></iframe>'
    j++;
    if(j==iframePages.length) {
      j=0;
      display="imgSite";
    }
  } else {
    console.log("ERROR - SHOULDN'T BE HERE IN advanceImage");
    console.log("ERROR - display value is " + display);
  }

}
