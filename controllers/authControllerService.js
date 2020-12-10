'use strict';

const database_repository = require('../repositories/database');

module.exports.authRegister = function authRegister (req, res, next) {
  
  const user = {
    username: req.user.value.username,
    password: req.user.value.password,
    name: req.user.value.name,
    surname: req.user.value.surname,
    email: req.user.value.email,
    phone: req.user.value.phone
  };

  database_repository.addUser(user).then(() => {
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
  res.send({
    message: 'This is the mockup controller for authLogin'
  });
};

module.exports.authValidate = function authValidate (req, res, next) {
  res.send({
    message: 'This is the mockup controller for authValidate'
  });
};
