const axios = require('axios');
const redis = require('redis');

const CACHE_TTL = 5; // In seconds
const PRODUCTS_URL = process.env.PRODUCTS_HOSTNAME;
const REVIEWS_URL = process.env.REVIEWS_HOSTNAME;
const MESSAGING_URL = process.env.CHAT_HOSTNAME;

// Redis connection
const redisClient = redis.createClient({
  host: process.env.REDIS_HOSTNAME,
  port: process.env.REDIS_PORT
});

redisClient.on('error', function (error) {
  console.error(error);
});

// Products
exports.getUserProducts = (username) => {
  return new Promise((resolve, reject) => {
    getCache('userProducts-' + username).then((cached) => {
      if (cached === null) {
        axios.get(PRODUCTS_URL + '/api/v1/products/client/' + username).then(function (axiosResponse) {
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
      axios.get(PRODUCTS_URL + '/api/v1/products/client/' + username).then(function (axiosResponse) {
        resolve(axiosResponse);
      }).catch(function (error) {
        reject(error);
      });
    });
  });
};

exports.deleteUserProducts = (username, token) => {
  return new Promise((resolve, reject) => {
    axios.delete(PRODUCTS_URL + '/api/v1/products/client/' + username, { headers: { Authorization: 'Bearer ' + token } }).then(function (axiosResponse) {
      resolve(axiosResponse);
    }).catch(function (error) {
      reject(error);
    });
  });
};

// Reviews
exports.getUserReviews = (username) => {
  return new Promise((resolve, reject) => {
    getCache('userReviews-' + username).then((cached) => {
      if (cached === null) {
        axios.get(REVIEWS_URL + '/api/v1/reviews/client/' + username).then(function (axiosResponse) {
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
      axios.get(REVIEWS_URL + '/api/v1/reviews/client/' + username).then(function (axiosResponse) {
        resolve(axiosResponse);
      }).catch(function (error) {
        reject(error);
      });
    });
  });
};

exports.getAuthorReviews = (username) => {
  return new Promise((resolve, reject) => {
    getCache('authorReviews-' + username).then((cached) => {
      if (cached === null) {
        axios.get(REVIEWS_URL + '/api/v1/reviews/author/' + username).then(function (axiosResponse) {
          setCache('authorReviews-' + username, axiosResponse);
          resolve(axiosResponse);
        }).catch(function (error) {
          reject(error);
        });
      } else {
        resolve(cached);
      }
    }).catch(err => {
      console.log('error - Redis cache failed. Requesting instead. Redis error:\n', err.message);
      axios.get(REVIEWS_URL + '/api/v1/reviews/author/' + username).then(function (axiosResponse) {
        resolve(axiosResponse);
      }).catch(function (error) {
        reject(error);
      });
    });
  });
};

exports.deleteUserReviews = (username) => {
  return new Promise((resolve, reject) => {
    axios.delete(REVIEWS_URL + '/api/v1/reviews/client/' + username).then(function (axiosResponse) {
      resolve(axiosResponse);
    }).catch(function (error) {
      reject(error);
    });
  });
};

// Reviews
/* exports.getUserChats = (username) => {
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
}; */

exports.deleteUserChats = (username) => {
  return new Promise((resolve, reject) => {
    axios.get(MESSAGING_URL + '/messenger/room').then(function (axiosResponse) {
      resolve(axiosResponse);
    }).catch(function (error) {
      reject(error);
    });
  });
};

// Cache functions

const setCache = (key, value) => {
  return new Promise((resolve, reject) => {
    // Remove circular values
    value.request = 'removed for cache';
    // Save cache
    redisClient.set(key, JSON.stringify(value), 'EX', CACHE_TTL, (err, reply) => {
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
    // Find and return cache
    redisClient.get(key, (err, reply) => {
      if (err === null) {
        resolve(JSON.parse(reply));
      } else {
        reject(err);
      }
    });
  });
};
