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

/*
db.find({response: {$exists: true}},function(err, docs) {
    console.log("err: ", err);
    console.log("Find ALL DOCUMENTS");
    console.log("Docs: ", docs);
    console.log("-------------------------------------------------------------");
});
*/

/*
db.find({"current_observation.temp_f":{$exists: true}},function(err, docs) {
    console.log("err: ", err);
    console.log("Find response.current_observation");
    console.log("Docs: ", docs);
    console.log("-------------------------------------------------------------");
});
*/

/*
 db.find({},function(err, docs) {

    for (value in docs) {
        console.log();
        console.log("local_tme_rec822: ", docs[value].current_observation.local_time_rfc822);
        console.log("observation time: ", docs[value].current_observation.observation_time);
        console.log("temp_f: ", docs[value].current_observation.temp_f);

    }
*/

var docs = db.find({}).sort({local_epoch_val:1}).exec(function(err,docs) {
    console.log("db.find.sort err: ", err);

    for (value in docs) {
        console.log();
        console.log("local_time_rec822: ", docs[value].current_observation.local_time_rfc822);
        console.log("observation time: ", docs[value].current_observation.observation_time);
        console.log("local_epoch typeof: ", typeof docs[value].current_observation.local_epoch);
        console.log("local_epoch: ", docs[value].current_observation.local_epoch);
        console.log("local_epoch_val: ", docs[value].local_epoch_val);
        console.log("temp_f: ", docs[value].current_observation.temp_f);
        console.log("_id: ", docs[value]._id);
    };
});

/*
    console.log("stringify docs");
    var json_stringify_obj = JSON.stringify(docs);
    console.log("after stringify docs");
    console.log("json_stringify_obj: ", json_stringify_obj);
    console.log("temp_f: ", json_stringify_obj.current_observation);

    console.log("parsing docs");
    var json_parse_obj= JSON.parse(docs);
    console.log("after parsing docs");
    console.log("------------------------------------------------------------");
});
*/

/*
db.find({'_id':'ohDrNMKcfvWuwWTN'}, function(err, docs) {
    console.log("err: ", err);
    console.log('ohDrNMKcfvWuwWTN' );
    console.log("Docs: ", docs);
    console.log("field specified: ", docs.current_observation.station_id);
    console.log("typeof: " , typeof(docs));
    console.log("-------------------------------------------------------------");
});
*/

/*

db.find({response:{current_observation: {$exists: true}}},function(err, docs) {
    console.log("err: ", err);
    console.log("Find response:{current_observation{");
    console.log("Docs: ", docs);
    console.log("typeof: " , typeof(docs));
    console.log("-------------------------------------------------------------");
});
*/
