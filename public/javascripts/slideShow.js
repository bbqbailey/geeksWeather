console.log("++++++++++++++ FINAL: theName should be Banjo +++++++++++++++++++");
console.log("In slideShow.js theName is " + theName);
console.log("In slideShow.js DELAY is " + DELAY);
console.log("Is Jim dead? " + HES_DEAD_JIM);
console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

var MinDelay=5000;

if(typeof DELAY === 'undefined') {
    console.log("ERROR: in slideShow.js, DELAY is undefined.");
    console.log("   Verify DELAY is passed as paramater in geeksWeather.js to /slideShow");
    console.log("   or within slideShow.jade");
    console.log("SETTING DELAY to MinDelay of " + MinDelay);
    DELAY = MinDelay;
} else if(DELAY < MinDelay) {
    console.log("WARNING: in slideShow.js, DELAY is set to a value less than MinDelay of " + MinDelay + " microseconds");
    console.log("   This could result in hammering the underlaying websites, so the value is being changed.");
    console.log("   Changing DELAY to MinDelay value of " + MinDelay + " microseconds.");
    DELAY=MinDelay;
} else {
   console.log("slideShow DELAY is: " + DELAY);
}

function iframeDidLoad() {
  alert('Done');
}

var i=0;
var firstTime = true;  //see firstTime below to uncoment
advanceImage();
//causes slideShow image to advance
setInterval(function() {
  console.log("slideShow.js setInterval() fired!");
  advanceImage();
}, DELAY);

function buildHtml( displayObj ) {
  console.log("buildHtml() entry: displayObj: ", displayObj);
//  var htmlString = '<' + displayObj.displayType + ' src="' + displayObj.uri + '" height="' + displayObj.height + '"
//'"width="' + displayObj.width + '">';
// var htmlString = '<' + displayObj.displayType + ' src="' + displayObj.uri + '" height="100%" >';
// var htmlString = '<' + displayObj.displayType + ' src="' + displayObj.uri + '" height="100%" >';
var height="100%";
var width=displayObj.width;
console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>displayObj.displayType: " + displayObj.displayType);
if(displayObj.displayType === "iframe") {
  width="100%";
}
 var htmlString = '<' + displayObj.displayType + ' src="' + displayObj.uri + '" height="' + height + '"  width="' + width + '">';
 console.log("buildHtml(): htmlString: " + htmlString);
  return htmlString;
}

function hesDeadJim() {
  console.log("hesDeadJim() entry");
  var htmlString = buildHtml(config.errorPage)
  console.log("hesDeadJim() exit");
  return htmlString;
}

function advanceImage() { //used with setInterval
  var htmlString="";
  console.log("slideShow.js: advanceImage(): value of HES_DEAD_JIM: " + HES_DEAD_JIM);
  if(HES_DEAD_JIM) {
    htmlString = hesDeadJim();  //always do this first
  // ==== uncomment the following if you want a special first page that only runs first time.
} else if(firstTime) { //then show splashPage
      console.log("firstTime is true");
      console.log("   calling buildHtml with config.splashPage value: ", config.splashPage);
      htmlString=buildHtml(config.splashPage);
      firstTime=false;
  } else if(pauseCheckboxValue==='Checked') {
      console.log("advanceImage(): pauseCheckboxValue === 'Checked'");
      console.log("returning to avoid advancing or redisplaying same page");
      return;
  } else {
    htmlString = buildHtml(config.displayPages[i]);
    i++;
    if(i==config.displayPages.length) {
      i=0;
    }
  }
  document.getElementById('slideShowImage').innerHTML=htmlString;
}

var pauseCheckboxValue='';
function pauseChanged(element) { //used with checkbox
  console.log("slideShow.js pauseChanged() entry");
  element.checked ? pauseCheckboxValue="Checked": pauseCheckboxValue="";
  console.log("pauseCheckboxValue: " + pauseCheckboxValue);
}

function moveToDetailedInfo() { //used with button
  console.log("slideShow.js moveToDetailedInfo() entry");
  window.location.href="detailedInfo";
}

function moveToDocumentation() { //used with button
  console.log("slideShow.js moveToDocumentation() entry");
  window.location.href="geeksWeatherDoc";
}

function moveToCamera1() { //used with button
  console.log("slideShow.js moveToCamera1() entry");
  window.location.href="camera1";
}

function moveToCalendar() { //used with button
  console.log("slideShow.js moveToCalendar() entry");
  window.location.href="calendar";
}

function moveToCalendarEvents() { //used with button
  console.log("slideShow.js moveToCalendarEvents() entry");
  window.location.href="calendarEvents";
}

function nextSite() {  //used with button
  var htmlString = "";
  console.log("slideShow.js nextSite() entry: value of HES_DEAD_JIM: " + HES_DEAD_JIM);
  if(HES_DEAD_JIM) {
    htmlString = hesDeadJim();
  } else {
    i++;
    if(i>=config.displayPages.length)
      i=0;
    console.log('nextSite() i: ' + i + ' length: ' + config.displayPages.length);
    console.log("nextSite() image: ", config.displayPages[i].name );
    htmlString = buildHtml(config.displayPages[i]);
  }
  document.getElementById('slideShowImage').innerHTML=htmlString;
};

function prevSite() {  //used with button
  var htmlString = "";
  console.log("slideShow.js prevSite() entry: value of HES_DEAD_JIM: " + HES_DEAD_JIM);
  if(HES_DEAD_JIM) {
    htmlString = hesDeadJim();
  } else {
    i--;
    if(i<=0)
      i=config.displayPages.length-1;
    console.log('prevSite() i: ' + i + ' length: ' + config.displayPages.length);
    console.log("prevSite() image: ", config.displayPages[i].name );
    htmlString = buildHtml(config.displayPages[i]);
  }
  document.getElementById('slideShowImage').innerHTML=htmlString;
};
