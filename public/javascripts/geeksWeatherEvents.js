

var secsSinceLastTimeEvent=0;
var MAX_ELAPSED_TIMEOUT_SEC = 5; //maximum time since last time event received from server; if exceeded, then fail
var ERROR_TIME_FIELD = "ERROR";
var ERROR_TEMPF_FIELD = "";
var ERROR_EVENT_LISTENER_ERROR_CONNECTING = "EventListener-Error: Connecting...";
var ERROR_STATION = "Station: Connecting...";
var ERROR_INTERVAL_TIMEOUT = "Timeout: server update timed out.";
var INFO_EVENT_LISTENER_CLOSED = "Disconnected";
var INFO_EVENT_LISTENER_OPEN="EventSource Connected";
var INFO_EVENT_TIME="EventListener-Time: Connected.";
var COLOR_TIME_FIELD_NORMAL="#007700";
var COLOR_TIME_FIELD_ERROR="red";
var COLOR_TEMPF_FIELD_NORMAL="black";

var timeout = setInterval(function() {
    secsSinceLastTimeEvent++;
    if(secsSinceLastTimeEvent > MAX_ELAPSED_TIMEOUT_SEC) {
        console.log("ERROR: geeksWeatherEvents.js: secsSinceLastTimeEvent exceeded " + MAX_ELAPSED_TIMEOUT_SEC + " seconds.");
        console.log("ERROR: geeksWeatherEvents.js: No time events from server in " + secsSinceLastTimeEvent + " seconds");
        HES_DEAD_JIM = true;
        $("#time").text(ERROR_TIME_FIELD);
        $("#time").css({"color":COLOR_TIME_FIELD_ERROR});
        $("#temp_f").text(ERROR_TEMPF_FIELD);
        $("#state").text(ERROR_INTERVAL_TIMEOUT);
        $("#station").text(ERROR_STATION);
    } else {
        console.log("geeksWeatherEvents.js setInterval() seconds since last time event received from server: " + secsSinceLastTimeEvent);
    }

}, 1000);

if(!!window.EventSource) {
    console.log('inside window.EventSource');
    var source = new EventSource('/eventEngine');
    console.log('after call to EventSource');
    source.addEventListener('open', function(e) {
        $("#state").text(INFO_EVENT_LISTENER_OPEN);
        console.log(INFO_EVENT_LISTENER_OPEN);
    }, false);

    source.addEventListener('time', function(e) {
        console.log('eventListener Event: time: ', e);
        timeTemp = JSON.parse(e.data);
        console.log('time: ', timeTemp.time);
        $("#time").text(timeTemp.time);
        $("#time").css({"color":COLOR_TIME_FIELD_NORMAL});
        $("#temp_f").text(Math.round(timeTemp.temp_f));
        $("state").text(INFO_EVENT_TIME);
        HES_DEAD_JIM = false;
        secsSinceLastTimeEvent = 0; //reset cause we just got a time event from server

    })

    source.addEventListener('error', function(e) {
        console.log('eventlistener: error: ', e)
        if(e.target.readyState == EventSource.CLOSED) {
            $("#time").text(ERROR_TIME_FIELD);
            $("#time").css({"color":COLOR_TIME_FIELD_ERROR});
            $("#temp_f").text(ERROR_TEMPF_FIELD);
            $("#state").text(INFO_EVENT_LISTENER_CLOSED);
            $("#station").text(INFO_EVENT_LISTENER_CLOSED);
            HES_DEAD_JIM = true;
        } else if (e.target.readyState == EventSource.CONNECTING) {
            $("#time").text(ERROR_TIME_FIELD);
            $("#time").css({"color":"red"});
            $("#temp_f").text(ERROR_TEMPF_FIELD);
            $("#state").text(ERROR_EVENT_LISTENER_ERROR_CONNECTING);
            $("#station").text(ERROR_STATION);
            HES_DEAD_JIM = true;
        }
    }, false)
} else {
    console.log("Your browser doesn't support SSE")
}


