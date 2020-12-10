const userModel = require('../models/user');

// Get all users
exports.getUsers = async () => {
  return await userModel.find().exec();
};

// Get an user by username
exports.getUser = async (username) => {
  return await userModel.find({ username: username }).exec()
};

// Add a new user
exports.addUser = async (user) => {
  return userModel.create(user);
};

// Delete an user

exports.deleteUser = async (username) => {
  return await userModel.deleteOne({ username: username }).exec()
};

// Update an user

exports.updateUser = async (username, user) => {
  return await userModel.updateOne({username: username}, user).exec()
};
