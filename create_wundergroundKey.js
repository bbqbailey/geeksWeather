var Datastore = require('nedb');
var key_db = new Datastore( { filename: './myWundergroundKey.db', autoload: true});

var myKey=" Place the key you obtained from wunderground.com in here. ";

key_db.insert({'my_key':myKey});
