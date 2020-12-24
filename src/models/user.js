const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password:{
    type: String,
    required: true,
    min: 3
  },
  name:{
    type: String,
    required: true
  },
  surname:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number`
    },
  },
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
