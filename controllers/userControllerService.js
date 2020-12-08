'use strict'

module.exports.getUsers = function getUsers(req, res, next) {
  res.send({
    message: 'This is the mockup controller for getUsers'
  });
};

module.exports.findUser = function findUser(req, res, next) {
  res.send({
    message: 'This is the mockup controller for findUser'
  });
};

module.exports.deleteUser = function deleteUser(req, res, next) {
  res.send({
    message: 'This is the mockup controller for deleteUser'
  });
};

module.exports.updateUser = function updateUser(req, res, next) {
  res.send({
    message: 'This is the mockup controller for updateUser'
  });
};

module.exports.getProfile = function getProfile(req, res, next) {
  res.send({
    message: 'This is the mockup controller for getProfile'
  });
};