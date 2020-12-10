'use strict';
const connection = require('./connection'); // Database connection

const fs = require('fs');
const http = require('http');
const path = require('path');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({
  strict: false
}));
const oasTools = require('oas-tools');
const jsyaml = require('js-yaml');
const serverPort = process.env.PORT || 8080;

const spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.yaml'), 'utf8');
const oasDoc = jsyaml.safeLoad(spec);

const optionsObject = {
  controllers: path.join(__dirname, './controllers'),
  loglevel: 'info',
  strict: false,
  router: true,
  validator: true
};

app.use((req, res, next) => {
  req.connection = connection;
  next();
});

oasTools.configure(optionsObject);

oasTools.initialize(oasDoc, app, function () {
  http.createServer(app).listen(serverPort, function () {
    console.log('App running at http://localhost:' + serverPort);
    console.log('________________________________________________________________');
    if (optionsObject.docs !== false) {
      console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
      console.log('________________________________________________________________');
    }
  });
});

app.get('/info', function (req, res) {
  res.send({
    info: 'This API was generated using oas-generator!',
    name: oasDoc.info.title
  });
});
