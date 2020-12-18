'use strict';

const deploy = (env) => {
  return new Promise((resolve, reject) => {
    const connection = require('./connection'); // Database connection

    const fs = require('fs');
    const http = require('http');
    const path = require('path');

    const express = require('express');
    const app = express();
    const bodyParser = require('body-parser');

    process.env.TOKEN_EXPIRATION = '24h';

    process.env.SEED_AUTENTICACION = process.env.SEED_AUTENTICACION || 'seed-develop';

    app.use(bodyParser.json({
      strict: false
    }));
    const oasTools = require('oas-tools');
    const jsyaml = require('js-yaml');
    const serverPort = process.env.PORT || 8080;

    const spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.yaml'), 'utf8');
    const oasDoc = jsyaml.safeLoad(spec);

    const optionsObject = {
      controllers: path.join(__dirname, './src/controllers'),
      loglevel: env === 'test' ? 'error' : 'info',
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
        if (env !== 'test') {
          console.log('App running at http://localhost:' + serverPort);
          console.log('________________________________________________________________');
          if (optionsObject.docs !== false) {
            console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
            console.log('________________________________________________________________');
          }
        }
        resolve();
      });
    });

    app.get('/info', function (req, res) {
      res.send({
        info: 'This API was generated using oas-generator!',
        name: oasDoc.info.title
      });
    });
  });
};

const undeploy = () => {
  process.exit();
};

module.exports = {
  deploy: deploy,
  undeploy: undeploy
};
