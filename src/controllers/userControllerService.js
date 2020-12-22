'use strict';

const databaseRepository = require('../repositories/database');

module.exports.getUsers = function getUsers (req, res, next) {
  databaseRepository.getUsers().then((doc) => {
    res.status(200).send(doc);
  }).catch((err) => {
    if (err.status && err.message) {
      res.status(err.status).send({ err: err.message });
    }
    res.status(500).send({ err });
  });
};

module.exports.findUser = function findUser (req, res, next) {
  databaseRepository.getUser(req.username.value).then((doc) => {
    if (doc === null || doc.length === 0) {
      res.status(404).send({ err: 'User not found' });
    } else {
      res.status(200).send(doc);
    }
  }).catch((err) => {
    if (err.status && err.message) {
      res.status(err.status).send({ err: err.message });
    }
    res.status(500).send({ err });
  });
};

module.exports.deleteUser = function deleteUser (req, res, next) {
  databaseRepository.deleteUser(req.username.value).then((doc) => {
    res.status(202).send();
  }).catch((err) => {
    if (err.status && err.message) {
      res.status(err.status).send({ err: err.message });
    }
    res.status(500).send({ err });
  });
};

module.exports.updateUser = function updateUser (req, res, next) {
  const user = {
    username: req.user.value.username,
    password: req.user.value.password,
    name: req.user.value.name,
    surname: req.user.value.surname,
    email: req.user.value.email,
    phone: req.user.value.phone
  };

  databaseRepository.updateUser(req.username.value, user).then((doc) => {
    if (doc.nModified === 0) {
      res.status(404).send(
        { message: 'User not found' }
      );
    } else {
      res.status(204).send(
        { message: 'User updated correctly' }
      );
    }
  }).catch((err) => {
    if (err.status && err.message) {
      res.status(err.status).send({ err: err.message });
    }
    res.status(500).send({ err });
  });
};

module.exports.getProfile = function getProfile (req, res, next) {
  res.send({
    message: 'This is the mockup controller for getProfile'
  });
};
