var Myapp = require("./myapp");

var myapp = new Myapp(2016, "Mar");

myapp.getAllData(function(err, docs) {
  if(err) {
    console.log('useMyapp.js getAllData error: ', err);
  } else {
    console.log('useMyapp.js getAllData docs: ', docs);
  }
});
