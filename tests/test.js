const assert = require('assert');
const axios = require('axios');
const nock = require('nock');
const fs = require('fs');
const path = require('path');

const server = require('../server');

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
    server.deploy('test').then(() => {
      setTimeout(() => {
        console.log("\n\n----------------- Test-----------------\n");
        done();
      }, 1000);
    }).catch((err) => {
      console.log(err.message);
      done(err);
    });
  });

  // Delete this when tests are created
  describe('#API DB Controllers Test()', function () {
    apiDBControllersTest();
  });

  describe('#API Integrations Tests()', function () {
    apiMockControllersTest();
  });

  describe('#API Integrations Tests Cached()', function () {
    apiMockControllersTest();
  });

  describe('#API DB Controllers Delete Test()', function () {
    apiDBControllersDeleteTest();
  });

  after((done) => {
    server.undeploy(done);
  });
});

function apiDBControllersTest() {
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

  it('#userRegister - Should respond with a 201', function (done) {
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

  it('#userRegister(Same username) - Should respond with a 409', function (done) {
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

  it('#authLogin(wrong credentials) - Should respond with a 401', function (done) {
    const url = baseURL + '/api/v1/auth/login/';
    body = {
      username: "veryStrangeName",
      password: "veryStrangePass"
    };

    axios
      .post(url, body)
      .then((response) => {
        assert.fail('POST should have failed');
      })
      .catch((err) => {
        assert.strictEqual(401, err.response.status);
        done();
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
}

function apiMockControllersTest() {
  it('#profileGET - Should respond with a 200 Ok', function (done) {
    const url = baseURL + '/api/v1/profile/' + exampleUser.username;
    
    nock(process.env.PRODUCTS_HOSTNAME)
      .get("/api/v1/products/client/" + exampleUser.username)
      .reply(200, [
        {
          "name": "product1",
          "category": "category1",
          "price": "130",
          "seller": exampleUser.username,
          "id": 1
        }
      ]
      );

    nock(process.env.REVIEWS_HOSTNAME)
      .get("/api/v1/reviews/client/" + exampleUser.username)
      .reply(200, [
        {
          "title": "Not that good bro",
          "score": 1,
          "description": "Meh",
          "reviewedProductId": "product1",
          "reviewedClientId": "paco",
          "comments": [
            {
              "id": "48057bfe-c0ca-445c-83dd-14ef979ca5fc",
              "clientId": "600437d985639e47dad82d87",
              "body": "Be careful buddy 2222",
              "date": "2021-01-24T17:43:05.881Z"
            }
          ],
          "id": "550daa56-989b-41c7-8e25-c9ce4ea2f2c5",
          "dateCreated": "2021-01-24T17:42:42.075Z",
          "externalScore": "Neutral",
          "reviewerClientId": "600437d985639e47dad82d87"
        }
      ]);

    axios
      .get(url)
      .then((response) => {
        const expectedResponse = JSON.parse(fs.readFileSync(path.join(__dirname, './profileResponse.json'), 'utf-8'));
        const toCompare = {... response.data};
        delete toCompare._id;
        assert.deepStrictEqual(expectedResponse, toCompare);
        assert.strictEqual(200, response.status);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        assert.fail('Error on request');
      });
  });
}

function apiDBControllersDeleteTest() {
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
        assert.fail('User should not exist');
      })
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
