const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    require: true
  },
  password: String,
  name: String,
  surname: String,
  email: String,
  phone: String
});

// Delete the password from the return
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

userSchema.plugin(uniqueValidator, {
  message: '{PATH} must be unique'
});

const user = mongoose.model('user', userSchema);

module.exports = user;
