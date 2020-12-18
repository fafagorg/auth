const axios = require('axios');
const redis = require('redis');

const CACHE_TTL = 5; // In seconds
const PRODUCTS_URL = 'https://';
const REVIEWS_URL = 'https://';
const MESSAGING_URL = 'https://';

// Redis connection
const redisClient = redis.createClient();

redisClient.on('error', function (error) {
  console.error(error);
});

// Products
exports.getUserProducts = (username) => {
  return new Promise((resolve, reject) => {
    getCache('userProducts-' + username).then((cached) => {
      if (cached === null) {
        axios.get(PRODUCTS_URL + '/prducts/client/' + username).then(function (axiosResponse) {
          setCache('userProducts-' + username, axiosResponse);
          resolve(axiosResponse);
        }).catch(function (error) {
          reject(error);
        });
      } else {
        resolve(cached);
      }
    }).catch(err => {
      console.log('error - Redis cache failed. Requesting instead. Redis error:\n', err.message);
      axios.get(PRODUCTS_URL + '/prducts/client/' + username).then(function (axiosResponse) {
        resolve(axiosResponse);
      }).catch(function (error) {
        reject(error);
      });
    });
  });
};

// Reviews
exports.getUserReviews = (username) => {
  return new Promise((resolve, reject) => {
    getCache('userReviews-' + username).then((cached) => {
      if (cached === null) {
        axios.get(REVIEWS_URL + '/reviews/client/' + username).then(function (axiosResponse) {
          setCache('userReviews-' + username, axiosResponse);
          resolve(axiosResponse);
        }).catch(function (error) {
          reject(error);
        });
      } else {
        resolve(cached);
      }
    }).catch(err => {
      console.log('error - Redis cache failed. Requesting instead. Redis error:\n', err.message);
      axios.get(REVIEWS_URL + '/reviews/client/' + username).then(function (axiosResponse) {
        resolve(axiosResponse);
      }).catch(function (error) {
        reject(error);
      });
    });
  });
};

// Reviews
exports.getUserChats = (username) => {
  return new Promise((resolve, reject) => {
    getCache('userChats-' + username).then((cached) => {
      if (cached === null) {
        axios.get(MESSAGING_URL + '/messenger/room').then(function (axiosResponse) {
          setCache('userChats-' + username, axiosResponse);
          resolve(axiosResponse);
        }).catch(function (error) {
          reject(error);
        });
      } else {
        resolve(cached);
      }
    }).catch(err => {
      console.log('error - Redis cache failed. Requesting instead. Redis error:\n', err.message);
      axios.get(MESSAGING_URL + '/messenger/room').then(function (axiosResponse) {
        resolve(axiosResponse);
      }).catch(function (error) {
        reject(error);
      });
    });
  });
};

// Cache functions

const setCache = (key, value) => {
  return new Promise((resolve, reject) => {
    redisClient.set(key, value, 'EX', CACHE_TTL, (err, reply) => {
      if (err === null) {
        resolve();
      } else {
        reject(err);
      }
    });
  });
};

const getCache = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, reply) => {
      if (err === null) {
        resolve(reply);
      } else {
        reject(err);
      }
    });
  });
};
