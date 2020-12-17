const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Get all users
exports.getUsers = async () => {
  return await userModel.find().exec();
};

// Get an user by username
exports.getUser = async (username) => {
  return await userModel.find({ username: username }).exec();
};

// Delete an user

exports.deleteUser = async (username) => {
  return await userModel.deleteOne({ username: username }).exec();
};

// Update an user

exports.updateUser = async (username, user) => {
  return await userModel.updateOne({ username: username }, user).exec();
};

// Register

exports.addUser = async (user) => {
  user.password = bcrypt.hashSync(user.password, 10);
  return userModel.create(user);
};

// Login

exports.login = async (username, password) => {
  return new Promise((resolve, reject) => {
    userModel.findOne({ username: username }).exec().then((user) => {
      if (!user) {
        reject(new Error('User or password wrong'));
      }

      if (!bcrypt.compareSync(password, user.password)) {
        reject(new Error('User or password wrong'));
      }
      const token = jwt.sign({
        usuario: user
      }, process.env.SEED_AUTENTICACION, {
        expiresIn: process.env.TOKEN_EXPIRATION
      });
      resolve(token);
    }).catch((err) => {
      reject(new Error(err));
    });
  });
};

// Validate token auth

exports.validateToken = async (token) => {
  return new Promise((resolve, reject) => {
    if (token) {
      jwt.verify(token, process.env.SEED_AUTENTICACION, (err, decoded) => {
        if (err) {
          resolve(false);
        } else {
          resolve(decoded);
        }
      });
    } else {
      resolve(false);
    }
  });
};
