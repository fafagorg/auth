const assert = require('assert');
const axios = require('axios');
const { compare } = require('bcrypt');
const { response } = require('express');

const server = require('../server');
const user = require('../src/models/user');
const nockController = require('./nockController');


const base_url = 'http://localhost:'+server.serverPort

const example_user = {
  "username": "username",
  "name": "name",
  "surname": "surname",
  "email": "mail",
  "phone": "12345678",
  "password": 'pass'
}

var token;

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
      assert.strictEqual([1, 2, 3].indexOf(4), -1);
    });
  });

  describe('#apiDBControllersTest()', function () {
    apiDBControllersTest();
  });

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
    it('Should respond with a 200 Ok', function (done) {
      var url = base_url + '/api/v1/users'
      axios.get(url).then(response => {
        assert.strictEqual(200, response.status);
        done();
      }).catch(err => {
        console.log(err.message);
        assert.fail('Error on request');
      });
    });
  });

  describe('#userPOST', function () {
    it('Should respond with a 201', function (done) {
      var url = base_url + '/api/v1/auth/register'
      body= example_user
      axios.post(url, body).then(response => {
        assert.strictEqual(201, response.status); 
        done();
      }).catch(err => {
        console.log(err.message);
        assert.fail('Error on request');
      });
    });
  })

  
  describe('#userPOST(Same username)', function () {
    it('Should respond with a 409', function (done) {
      var url = base_url + '/api/v1/auth/register'
      body= example_user
      axios.post(url, body).then(response => {

      }).catch(err => {
        assert.strictEqual(409, err.response.status)
        done();

      });
    });
  })

  describe('#userGET', function () {
    it('Should respond with a 200 Ok', function (done) {
      var url = base_url + '/api/v1/users/' + example_user.username
      axios.get(url).then(response => {
        assert.strictEqual(200, response.status);
        done();
      }).catch(err => {
        console.log(err.message);
        assert.fail('Error on request');
      });
    });
  });
  


  describe('#userPut', function () {
    it('Should respond with a 204', function (done) {
      var changedName = 'change'
      var url = base_url + '/api/v1/users/' + example_user.username
      body= example_user
      body.name = changedName
      axios.put(url, body).then(response => {
        
        assert.strictEqual(204, response.status); 
        done();
      }).catch(err => {
        console.log(err.message);
        assert.fail('Error on request');
      });
    });
  })

  describe('#authLogin', function () {
    it('Should respond with a 200', function (done) {
      var url = base_url + '/api/v1/auth/login/'
      body = {
        username : example_user.username,
        password : example_user.password
      }

      axios.post(url, body).then(response => {
        token = response.data.token
        assert.strictEqual(200, response.status); 
        done();
      }).catch(err => {
        console.log(err.message);
        assert.fail('Error on request');
      });
    });
  })


  
  describe('#authValidate', function () {
    it('Should respond with a 200', function (done) {
      var url = base_url + '/api/v1/auth/validate/'
      body = {
        token : token
      }
      axios.post(url, body).then(response => {
        assert.strictEqual(200, response.status); 
        done();
      }).catch(err => {
        console.log(err.message);
        assert.fail('Error on request');
      });
    });
  })


  
  describe('#usersDelete', function () {
    it('Should respond with a 202', function (done) {
      var url = base_url + '/api/v1/users/' + example_user.username

      axios.delete(url).then(response => {
        
        assert.strictEqual(202, response.status); 
        done();
      }).catch(err => {
        console.log(err.message);
        assert.fail('Error on request');
      });
    });
  })

  describe('#userGET(Does not exist)', function () {
    it('Should respond with a 404 Not found', function (done) {
      var url = base_url + '/api/v1/users/' + example_user.username
      axios.get(url).then(response => {
      }).catch(err => {
        assert.strictEqual(404, err.response.status)
        done();
      });
    });
  });
  

  describe('#userPut(Does not exist)', function () {
    it('Should respond with a 404 Not found', function (done) {
      var changedName = 'change'
      var url = base_url + '/api/v1/users/' + example_user.username
      body= example_user
      body.name = changedName
      axios.put(url, body).then(response => {
      }).catch(err => {
        assert.strictEqual(404, err.response.status)
        done();
      });
    });
  })

  
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
