'use strict';

const databaseRepository = require('../repositories/database');

module.exports.authRegister = function authRegister (req, res, next) {
  const user = {
    username: req.user.value.username,
    password: req.user.value.password,
    name: req.user.value.name,
    surname: req.user.value.surname,
    email: req.user.value.email,
    phone: req.user.value.phone
  };

  databaseRepository.addUser(user).then(() => {
    res.status(201).send({
      message: 'User created correctly'
    });
  }).catch((err) => {
    if (err.status && err.message) {
      res.status(err.status).send({ err: err.message });
    }
    res.status(500).send({ err });
  });
};

module.exports.authLogin = function authLogin (req, res, next) {
  const login = req.user.value;
  databaseRepository.login(login.username, login.password).then((token) => {
    console.log(token);
    if (token !== undefined) {
      res.status(200).send({
        ok: true,
        user: login.username,
        token: token
      });
    } else {
      res.status(401).send({
        err: 'Username or password wrong'
      });
    }
  }).catch((err) => {
    if (err.status && err.message) {
      res.status(err.status).send({ err: err.message });
    }
    res.status(500).send({ err });
  });
};

module.exports.authValidate = function authValidate (req, res, next) {
  res.send({
    message: 'This is the mockup controller for authValidate'
  });
};
