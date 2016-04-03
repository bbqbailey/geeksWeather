var assert = require('assert');
var fs = require('fs');

fs.existsSync("bbq.js", function(result) {
  console.log('False: fs.exists(bbq.js) says: ', result);
})

fs.existsSync("test2.js", function(result) {
  console.log('True: fs.exists(test2.js) says: ', result);
})

describe('Testing Synch fs.existsSync() ===', function() {
  describe('False: fs.exists(bbq.js)', function() {
    it("This assertion should pass, as we are asserting false on file that doesn't exist.", function() {
      assert.equal(false, fs.existsSync(__dirname + "/bbq.js", function(result) { return result;}))
    });
  });

  describe('Testing Synch fs.existsSync(test2.js method A)', function() {
    it("This assertions should pass as we are asserting true on file that does exist", function() {
      assert.equal(true, fs.existsSync(__dirname + "/test2.js", function(result) {
        return result;
      }));
    });
  });

  describe('Testing Synch fs.existsSync(test2.js method B)', function() {
    it("This assertions should pass as we are are asserting true on file that does exist using callback", function() {
      fs.existsSync(__dirname + "/test2.js", function(result) {
        assert.equal(true, result);
      });
    });
  });
});


////////////////////

describe('Asynch test of fs.exists() === some results are UNDEFINED because of async', function() {
  describe('False: fs.exists(bbq.js)', function() {
    it("This assertion should pass as we are expecting undefined result due to async.", function() {
      assert.equal(undefined, fs.exists(__dirname + "/bbq.js", function(result) { return result;}))
    });
  });

  describe('True: fs.exists(test2.js method A)', function() {
    it("This assertion should pass as we are expecting undefined result due to async.", function() {
      assert.equal(undefined, fs.exists(__dirname + "/test2.js", function(result) {
        return result;
      }));
    });
  });


  describe('True: fs.exists(test2.js method B)', function() {
    it("This equal assertion passes, because of use of callback waits for response.", function() {
      fs.exists(__dirname + "/test2.js", function(result) {
        assert.equal(true, result);
      });
    });
  });
});
