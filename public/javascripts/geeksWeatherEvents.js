

var secsSinceLastTimeEvent=0;
var MAX_ELAPSED_TIMEOUT_SEC = 5; //maximum time since last time event received from server; if exceeded, then fail

var timeout = setInterval(function() {
    secsSinceLastTimeEvent++;
    if(secsSinceLastTimeEvent > MAX_ELAPSED_TIMEOUT_SEC) {
        console.log("ERROR: geeksWeatherEvents.js: secsSinceLastTimeEvent exceeded " + MAX_ELAPSED_TIMEOUT_SEC + " seconds.");
        console.log("ERROR: geeksWeatherEvents.js: No time events from server in " + secsSinceLastTimeEvent + " seconds");
        HES_DEAD_JIM = true;
    } else {
        console.log("geeksWeatherEvents.js setInterval() seconds since last time event received from server: " + secsSinceLastTimeEvent);
    }

}, 1000);



if(!!window.EventSource) {
    console.log('inside window.EventSource');
    var source = new EventSource('/eventEngine');
    console.log('after call to EventSource');
    source.addEventListener('open', function(e) {
        $("#state").text("EventSource Connected");
        console.log('open received');
    }, false);


    source.addEventListener('time', function(e) {
        console.log('eventListener: time: ', e);
        timeTemp = JSON.parse(e.data);
        console.log('time: ', timeTemp.time);
        $("#time").text(timeTemp.time);
        $("#temp_f").text(Math.round(timeTemp.temp_f));
        $("state").text("EventListener-Time Connected");
        HES_DEAD_JIM = false;
        secsSinceLastTimeEvent = 0; //reset cause we just got a time event from server

    })


    source.addEventListener('error', function(e) {
        console.log('eventlistener: error: ', e)
        if(e.target.readyState == EventSource.CLOSED) {
            $("#time").text("Error");
            $("#temp_f").text("");
            $("#state").text(" Disconnected");
            $("#station").text(" Disconnected");
            HES_DEAD_JIM = true;
        } else if (e.target.readyState == EventSource.CONNECTING) {
            $("#time").text("Error");
            $("#temp_f").text("");
            $("#state").text("EventListener-Error Connecting...");
            $("#station").text("Station: Connecting...");
            HES_DEAD_JIM = true;
        }
    }, false)
} else {
    console.log("Your browser doesn't support SSE")
}


