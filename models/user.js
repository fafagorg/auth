const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  surname: String,
  email: String,
  phone: String
});

const user = mongoose.model('user', userSchema);

module.exports = user;
