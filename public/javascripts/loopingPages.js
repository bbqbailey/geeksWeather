console.log("++++++++++++++ FINAL: theName should be Banjo +++++++++++++++++++");
console.log("In loopingPages.js theName is " + theName);
console.log("In loopingPages.js DELAY is " + DELAY);
console.log("Is Jim dead? " + HES_DEAD_JIM);
console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

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

var imgHeight="980px"

setInterval(function() {
  console.log("fired");
  advanceImage();
}, DELAY);

function buildHtml( displayObj ) {
  console.log("buildHtml() entry: displayObj: ", displayObj);
  var htmlString = '<' + displayObj.displayType + ' src="' + displayObj.uri + '" height="' + displayObj.height + '">;';
  console.log("buildHtml(): htmlString: " + htmlString);
  return htmlString;
}

var i=0;
var firstTime = true;

function hesDeadJim() {
  console.log("hesDeadJim() entry");
  var htmlString = buildHtml(sites.errorPage)
  console.log("hesDeadJim() exit");
  return htmlString;
}


function advanceImage() { //used with setInterval
  var htmlString="";
  console.log("loopingPages.js: advanceImage(): value of HES_DEAD_JIM: " + HES_DEAD_JIM);
  if(HES_DEAD_JIM) {
    htmlString = hesDeadJim();  //always do this first
  } else if(firstTime) { //then show splashPage
      console.log("firstTime is true");
      console.log("   calling buildHtml with sites.splashPage value: ", sites.splashPage);
      htmlString=buildHtml(sites.splashPage);
      firstTime=false;
  } else if(pauseCheckboxValue==='Checked') {
      console.log("advanceImage(): pauseCheckboxValue === 'Checked'");
      console.log("returning to avoid advancing or redisplaying same page");
      return;
  } else {
    htmlString = buildHtml(sites.displayPages[i]);
    i++;
    if(i==sites.length) {
      i=0;
    }
  }
  document.getElementById('imageDiv').innerHTML=htmlString;
}

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

function nextSite() {  //used with button
  var htmlString = "";
  console.log("loopingPages.js nextSite() entry: value of HES_DEAD_JIM: " + HES_DEAD_JIM);
  if(HES_DEAD_JIM) {
    htmlString = hesDeadJim();
  } else {
    i++;
    if(i==sites.displayPages.length)
      i=0;
    htmlString = buildHtml(sites.displayPages[i]);
    console.log("button advance; image: ", sites.displayPages[i].name);
  }
  document.getElementById('imageDiv').innerHTML=htmlString;
};
