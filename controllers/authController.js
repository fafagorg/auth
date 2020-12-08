'use strict'

var varauthController = require('./authControllerService');

module.exports.authRegister = function authRegister(req, res, next) {
  varauthController.authRegister(req.swagger.params, res, next);
};

module.exports.authLogin = function authLogin(req, res, next) {
  varauthController.authLogin(req.swagger.params, res, next);
};

module.exports.authValidate = function authValidate(req, res, next) {
  varauthController.authValidate(req.swagger.params, res, next);
};