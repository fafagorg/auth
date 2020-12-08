'use strict';

const varuserController = require('./userControllerService');

module.exports.getUsers = function getUsers (req, res, next) {
  varuserController.getUsers(req.swagger.params, res, next);
};

module.exports.findUser = function findUser (req, res, next) {
  varuserController.findUser(req.swagger.params, res, next);
};

module.exports.deleteUser = function deleteUser (req, res, next) {
  varuserController.deleteUser(req.swagger.params, res, next);
};

module.exports.updateUser = function updateUser (req, res, next) {
  varuserController.updateUser(req.swagger.params, res, next);
};

module.exports.getProfile = function getProfile (req, res, next) {
  varuserController.getProfile(req.swagger.params, res, next);
};
