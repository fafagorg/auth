const nock = require('nock');
const fs = require('fs');
const path = require('path');

module.exports.instantiateMockups = () => {
  return new Promise((resolve, reject) => {
    buildMockups(fs.readFileSync(path.join(__dirname, '/nockMockups.json'), 'utf-8'), '/nockMockups.json').then(() => {
      console.log("    Successfully loaded testing mockups!");
      resolve();
    }).catch((err) => {
      console.log('    No mockups file could be found! (nockMockups.json)');
      reject(err);
    });
  });
};

const buildMockups = (mockups, filename) => {
  return new Promise((resolve, reject) => {
    /* try {
      for (const mockup of JSON.parse(mockups)) {
        if (mockup.type === 'GET') {
          //nock(mockup.requestAPI, { allowUnmocked: true }).log(console.log).get(mockup.requestEndpoint).reply(200, mockup.response);
          nock(mockup.requestAPI, { allowUnmocked: true }).get(mockup.requestEndpoint).reply(200, mockup.response);
        } else if (mockup.type === 'POST') {
          //nock(mockup.requestAPI, { allowUnmocked: true }).log(console.log).post(mockup.requestEndpoint, mockup.body).reply(200, mockup.response);
          nock(mockup.requestAPI, { allowUnmocked: true }).post(mockup.requestEndpoint, mockup.body).reply(200, mockup.response);
        }
      }
      resolve();
    } catch (err) {
      console.log('There was a problem when building up mockups (' + filename + ').', err);
      resolve();
    } */
    resolve();
  });
};
