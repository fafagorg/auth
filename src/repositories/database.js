const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const cloudinary = require('cloudinary');

const {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

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
  user.password = bcrypt.hashSync(user.password, 10);
  return await userModel.updateOne({ username: username }, user).exec();
};

// Register

function decodeBase64Image (dataString) {
  /*eslint-disable */
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/); 
  /* eslint-enable */

  const response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = Buffer.from(matches[2], 'base64');
  // response.data = new Buffer(matches[2], 'base64');

  return response;
}

exports.addUser = async (user) => {
  return new Promise((resolve, reject) => {
    userModel.findOne({ username: user.username }).exec().then(async (u) => {
      if (u != null) {
        resolve(false);
      } else {
        const name = Math.random().toString(36).substring(7);
        let directory = 'temp/';
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory);
        }
        directory = directory + name + '.jpg';

        const imageBuffer = decodeBase64Image(user.photo);
        fs.writeFile(directory, imageBuffer.data, function (err) { console.log(err); });
        const res = await cloudinary.v2.uploader.upload(directory);
        user.photo = res.url;
        user.password = bcrypt.hashSync(user.password, 10);

        try {
          fs.unlinkSync(directory);
        } catch (err) {
          console.error(err);
        }
        userModel.create(user).then((m) => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        });
      }
    });
  });
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
        user: user
      }, process.env.SEED_AUTENTICATION, {
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
      jwt.verify(token, process.env.SEED_AUTENTICATION, (err, decoded) => {
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
