'use strict';

const databaseRepository = require('../repositories/database');

module.exports.authRegister = function authRegister (req, res, next) {
  const user = {
    username: req.user.value.username,
    password: req.user.value.password,
    name: req.user.value.name,
    surname: req.user.value.surname,
    email: req.user.value.email,
    phone: req.user.value.phone,
    photo: req.user.value.photo
  };

  databaseRepository.addUser(user).then((created) => {
    if (created) {
      res.status(201).send({
        message: 'User created correctly'
      });
    } else {
      res.status(409).send({
        message: 'Username is already taken'
      });
    }
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
  const token = req.user.value.token;
  if (token) {
    databaseRepository.validateToken(token).then((valid) => {
      if (valid) {
        res.status(200).send({ userId: valid.user.username });
      } else {
        res.status(403).send({ err: 'Token not valid' });
      }
    });
  } else {
    res.status(401).send({ err: 'Token not provided' });
  }
};
