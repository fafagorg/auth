'use strict'

module.exports.authRegister = function authRegister(req, res, next) {
  res.send({
    message: 'This is the mockup controller for authRegister'
  });
};

module.exports.authLogin = function authLogin(req, res, next) {
  res.send({
    message: 'This is the mockup controller for authLogin'
  });
};

module.exports.authValidate = function authValidate(req, res, next) {
  res.send({
    message: 'This is the mockup controller for authValidate'
  });
};