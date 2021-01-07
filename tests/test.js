const assert = require('assert');
const axios = require('axios');
const { compare } = require('bcrypt');
const { response } = require('express');

const server = require('../server');
const user = require('../src/models/user');
const nockController = require('./nockController');

const baseURL = 'http://localhost:' + server.serverPort;

const exampleUser = {
  username: 'username',
  name: 'name',
  surname: 'surname',
  email: 'mail@mail.com',
  phone: '123456789',
  password: 'pass'
};

let token;

describe('Tests array', function () {
  before((done) => {
    server
      .deploy('test')
      .then(() => {
        nockController
          .instantiateMockups()
          .then(() => {
            done();
          })
          .catch((err) => {
            console.log(err.message);
            done(err);
          });
      })
      .catch((err) => {
        console.log(err.message);
        done(err);
      });
  });

  // Delete this when tests are created
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

function apiDBControllersTest () {
  it('#usersGET - Should respond with a 200 Ok', function (done) {
    const url = baseURL + '/api/v1/users';
    axios
      .get(url)
      .then((response) => {
        assert.strictEqual(200, response.status);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        assert.fail('Error on request');
      });
  });

  it('#userPOST - Should respond with a 201', function (done) {
    const url = baseURL + '/api/v1/auth/register';
    const body = exampleUser;
    axios
      .post(url, body)
      .then((response) => {
        assert.strictEqual(201, response.status);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        assert.fail('Error on request');
      });
  });

  it('#userPOST(Same username) - Should respond with a 409', function (done) {
    const url = baseURL + '/api/v1/auth/register';
    const body = exampleUser;
    axios
      .post(url, body)
      .then((response) => {
        assert.fail('POST should have failed');
      })
      .catch((err) => {
        assert.strictEqual(409, err.response.status);
        done();
      });
  });

  it('#userGET - Should respond with a 200 Ok', function (done) {
    const url = baseURL + '/api/v1/users/' + exampleUser.username;
    axios
      .get(url)
      .then((response) => {
        assert.strictEqual(200, response.status);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        assert.fail('Error on request');
      });
  });

  it('#userPUT - Should respond with a 204', function (done) {
    const changedName = 'change';
    const url = baseURL + '/api/v1/users/' + exampleUser.username;
    const body = exampleUser;
    body.name = changedName;
    axios
      .put(url, body)
      .then((response) => {
        assert.strictEqual(204, response.status);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        assert.fail('Error on request');
      });
  });

  it('#authLogin - Should respond with a 200', function (done) {
    const url = baseURL + '/api/v1/auth/login/';
    body = {
      username: exampleUser.username,
      password: exampleUser.password
    };

    axios
      .post(url, body)
      .then((response) => {
        token = response.data.token;
        assert.strictEqual(200, response.status);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        assert.fail('Error on request');
      });
  });

  it('#authValidate - Should respond with a 200', function (done) {
    const url = baseURL + '/api/v1/auth/validate/';
    body = {
      token: token
    };
    axios
      .post(url, body)
      .then((response) => {
        assert.strictEqual(200, response.status);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        assert.fail('Error on request');
      });
  });

  it('#usersDelete - Should respond with a 202', function (done) {
    const url = baseURL + '/api/v1/users/' + exampleUser.username;

    axios
      .delete(url)
      .then((response) => {
        assert.strictEqual(202, response.status);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        assert.fail('Error on request');
      });
  });

  it('#userGET(Does not exist) - Should respond with a 404 Not found', function (done) {
    const url = baseURL + '/api/v1/users/' + exampleUser.username;
    axios
      .get(url)
      .then((response) => {
        assert.fail('User should not exist');})
      .catch((err) => {
        assert.strictEqual(404, err.response.status);
        done();
      });
  });

  it('#userPUT(Does not exist) - Should respond with a 404 Not found', function (done) {
    const changedName = 'change';
    const url = baseURL + '/api/v1/users/' + exampleUser.username;
    body = exampleUser;
    body.name = changedName;
    axios
      .put(url, body)
      .then((response) => {
        assert.fail('User should not exist');
      })
      .catch((err) => {
        assert.strictEqual(404, err.response.status);
        done();
      });
  });
}

function apiMockControllersTest () {
  describe('#productsGET', function () {
    it(
      'should respond with ' +
        testRequest.responseStatusCode +
        ' (' +
        testRequest.name +
        ')',
      function (done) {
        axios
          .post(url, body, options)
          .then((response) => {
            /* assert.notStrictEqual(expected, response);
        assert.deepStrictEqual(expected, response);
        assert.strictEqual(expected, response); */
            done();
          })
          .catch((err) => {
            console.log(err.message);
            assert.fail('Error on request');
          });
      }
    );
  });
}
