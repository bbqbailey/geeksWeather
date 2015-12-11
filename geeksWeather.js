var request = require('request');
var express = require('express');
var Datastore = require('nedb');
var db = new Datastore( { filename: './wunderground.db', autoload: true});

/*
db.find({}, function(err, docs) {
    //finds all docs
    console.log("Finding all");
    console.log("Finding all documents in the collection: ", docs);
    console.log();
});
*/

var app = express();
var Wunderground = require('wundergroundnode');
var myKey="2ef1c545be424ebb"
var wunderground = new Wunderground(myKey);
var port=4000;
var developers_example='84111';
var alpharettaStation='pws:KGAALPHA23';

/*
app.get('/', function(req, res, next) {
});

app.listen(4000);
console.log('Express started on port ' + port);
*/

//wunderground.conditions().request(alpharettaStation, function(err, response){

var url = 'http://api.wunderground.com/api/' + myKey + '/conditions/' +  'q/'+ alpharettaStation + '.json';


request(url, function(error, response, body) {
    console.log("callback!");
    console.log(body);
    console.log("=============================================");
    console.log("body: " + body);
    console.log("inserting into nedb");

    json_string = body.trim();

    json_obj = JSON.parse(json_string);

    db.insert(json_obj, function (err, newDoc) {
        console.log("Inserting:");
        console.log("err: ", err);
        console.log("newDoc: ", newDoc);
    });
});
