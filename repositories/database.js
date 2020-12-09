const userModel = require('../models/user');

// Get all users
exports.getUsers = async () => {
  res = await userModel.find().exec().then((doc) => {
    return res.status(200).json(doc);
  })
    .catch((err) => {
      if (err.status && err.message) {
        return res.status(err.status).send({ err: err.message });
      }
      return res.status(500).send({ err });
    });
};

// Get an user by username
exports.getUser = async (username) => {
  res = await userModel.findOne({ username: username }).exec().then((doc) => {
    return res.status(200).json(doc);
  })
    .catch((err) => {
      if (err.status && err.message) {
        return res.status(err.status).send({ err: err.message });
      }
      return res.status(500).send({ err });
    });
};

// Add a new user
exports.addUser = async (user) => {
  var new_user = new userModel(user);

  await new_user.validate();
  return "Created"
};

// Delete an user

exports.deleteUser = async (username) => {
  res = await userModel.deleteOne({ username: username }).exec().then((doc) => {
    return res.status(200).json(doc);
  })
    .catch((err) => {
      if (err.status && err.message) {
        return res.status(err.status).send({ err: err.message });
      }
      return res.status(500).send({ err });
    });
};

// Update an user

exports.deleteUser = async (username, user, res) => {
  res = await userModel.updateOne(username, user).exec().then((doc) => {
    return res.status(200).json(doc);
  })
    .catch((err) => {
      if (err.status && err.message) {
        return res.status(err.status).send({ err: err.message });
      }
      return res.status(500).send({ err });
    });
};
