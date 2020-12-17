
const mongoose = require('mongoose');

const {
  MONGO_PORT,
  MONGO_DB
} = process.env;


const options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 10000,
};

const url = `mongodb://172.17.0.1:${MONGO_PORT}/${MONGO_DB}`;
console.log(url)
const ms = 10000;

const connect = ()=>{
  mongoose.connect(url, options).then( function() {
    console.log('MongoDB is connected');
  })
    .catch( function(err) {
      setTimeout(() => {
        connect()
      }, ms);
      console.log("Failed connected to mongo, retrying in " + ms)
      console.log(err);
  });
}

connect()
