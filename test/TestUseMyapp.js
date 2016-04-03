var expect = require('chai').expect;
var sinon = require('mocha-sinon');
var assert = expect.assert;

var Myapp = require("../public/javascripts/myapp");


describe("Testing nedb", function() {
  it("here we go with the call", function() {
    var myapp = new Myapp(2016, "Mar");
    console.log('TestUseMyapp.js __dirname: ', __dirname);
    console.log('TestUseMyapp.js myapp: ', myapp);
    myapp.getAllData();
  });
});
