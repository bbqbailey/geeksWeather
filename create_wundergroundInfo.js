var Datastore = require('nedb');
var key_db = new Datastore( { filename: './myWundergroundInfo.db', autoload: true});

var myKey   = " Place the key you obtained from wunderground.com in here. ";
var city    = " Place the city you want information on here";
var state   = " Place the two-letter state abbreviation associated with the city you specified here";
var zip     = " Place the zip code for the city, state you are interested in here";
var station = " If you have a particular wunderground pws station you are interested in, place it here";
var myServer = " The server you are running this program on.  Can be domain or IP.  E.g., 192.168.1.101";
var myPort  = " The port your server will respond to.  E.g., 8080";

key_db.insert({
    'my_key':myKey,
    'city': city,
    'state': state, 
    'zip': zip,
    'station': station,
    'myServer': myServer,
    'myPort': myPort
});
