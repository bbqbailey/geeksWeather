var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res, next) {
});

app.listen(3000);
console.log('Express started on port 3000');

