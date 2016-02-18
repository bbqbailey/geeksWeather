console.log("geeksWeatherEvents.js - Is Jim Dead? " + HES_DEAD_JIM);

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
