
const mongoose = require('mongoose');

const {
  MONGO_PORT,
  MONGO_DB
} = process.env;

const options = {
  useNewUrlParser: true,
  connectTimeoutMS: 10000,
  useUnifiedTopology: true
};

const url = `mongodb://172.17.0.1:${MONGO_PORT}/${MONGO_DB}`;

const MONGO_RETRY_INTERVAL = 10000; // In milliseconds

const connect = () => {
  mongoose.connect(url, options).then(function () {
    console.log('MongoDB is connected');
  }).catch(function (err) {
    setTimeout(() => {
      connect();
    }, MONGO_RETRY_INTERVAL);
    console.log('Failed to connect to mongo, retrying in ' + MONGO_RETRY_INTERVAL / 1000 + 's');
    console.log(err);
  });
};

connect();
