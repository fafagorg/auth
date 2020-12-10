'use strict';

const database_repository = require('../repositories/database');

module.exports.getUsers = function getUsers (req, res, next) {
  database_repository.getUsers().then((doc) => {
    console.log(doc)
    res.status(200).send(doc);
  }).catch((err) => {
    if (err.status && err.message) {
      res.status(err.status).send({ err: err.message });
    }
      res.status(500).send({ err });
  });
};

module.exports.findUser = function findUser (req, res, next) {
  database_repository.getUser(req.username.value).then((doc)=>{
    if(doc==null || doc.length==0){
      res.status(400).send({err: "User not found"});
    }else{
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
  database_repository.deleteUser(req.username.value).then((doc)=>{
    res.status(200).send({
      message: 'User deleted correctly'
    })
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

  database_repository.updateUser(req.username.value, user).then((doc)=>{
    res.status(204).send(
      {message: 'User updated correctly'}
    )
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
