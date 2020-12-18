const assert = require('assert');
const axios = require('axios');

const server = require('../server');
const nockController = require('./nockController');

describe('Tests array', function () {
  before((done) => {
    server.deploy('test').then(() => {
      nockController.instantiateMockups().then(() => {
        done();
      }).catch(err => {
        console.log(err.message);
        done(err);
      });
    }).catch(err => {
      console.log(err.message);
      done(err);
    });
  });

  // Delete this when tests are created
  describe('#placeholderTest(deleteThis)', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });

  /* describe('#apiDBControllersTest()', function () {
    apiDBControllersTest();
  }); */

  /* describe('#apiMockControllersTest()', function () {
    apiMockControllersTest();
  });

  describe('#apiMockControllersTestCached()', function () {
    apiMockControllersTest();
  }); */

  after((done) => {
    server.undeploy(done);
  });
});


function apiDBControllersTest() {
  describe('#usersGET', function () {
    it('should respond with ...', function (done) {
      axios.post(url, body, options).then(response => {
        /* assert.notStrictEqual(expected, response);
        assert.deepStrictEqual(expected, response);
        assert.strictEqual(expected, response); */
        done();
      }).catch(err => {
        console.log(err.message);
        assert.fail('Error on request');
      });
    });
  });

  describe('#usersPOST', function () {
    it('should respond with ...', function (done) {
      axios.post(url, body, options).then(response => {
        /* assert.notStrictEqual(expected, response);
        assert.deepStrictEqual(expected, response);
        assert.strictEqual(expected, response); */
        done();
      }).catch(err => {
        console.log(err.message);
        assert.fail('Error on request');
      });
    });
  });
}

function apiMockControllersTest() {
  describe('#productsGET', function () {
    it('should respond with ' + testRequest.responseStatusCode + ' (' + testRequest.name + ')', function (done) {
      axios.post(url, body, options).then(response => {
        /* assert.notStrictEqual(expected, response);
        assert.deepStrictEqual(expected, response);
        assert.strictEqual(expected, response); */
        done();
      }).catch(err => {
        console.log(err.message);
        assert.fail('Error on request');
      });
    });
  });
}
