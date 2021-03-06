'use strict';

const databaseRepository = require('../repositories/database');
const microservicesRepository = require('../repositories/microservices');

module.exports.getUsers = function getUsers (req, res, next) {
  databaseRepository.getUsers().then((doc) => {
    res.status(200).send(doc);
  }).catch((err) => {
    if (err.status && err.message) {
      res.status(err.status).send({ err: err.message });
    }
    res.status(500).send({ err });
  });
};

module.exports.findUser = function findUser (req, res, next) {
  databaseRepository.getUser(req.username.value).then((doc) => {
    if (doc === null || doc === undefined || doc.length === 0) {
      res.status(404).send({ err: 'User not found' });
    } else {
      res.status(200).send(doc[0]);
    }
  }).catch((err) => {
    if (err.status && err.message) {
      res.status(err.status).send({ err: err.message });
    }
    res.status(500).send({ err });
  });
};

module.exports.deleteUser = function deleteUser (req, res, next) {
  // microservicesRepository.deleteUserReviews(req.username.value).then(() => {
  microservicesRepository.deleteUserProducts(req.username.value, res.req.headers.authorization).then(() => {
    databaseRepository.deleteUser(req.username.value).then((doc) => {
      res.status(202).send();
    }).catch((err) => {
      console.log('User could not be deleted', err);
      if (err.status && err.message) {
        res.status(err.status).send({ err: err.message });
      }
      res.status(500).send({ err });
    });
  }).catch(err => {
    console.log('User Products could not be deleted\n', err);
  });
  // }).catch(err => {
  //  console.log("User Reviews could not be deleted\n", err);
  // })
};

module.exports.updateUser = function updateUser (req, res, next) {
  const user = {
    username: req.user.value.username,
    password: req.user.value.password,
    name: req.user.value.name,
    surname: req.user.value.surname,
    email: req.user.value.email,
    phone: req.user.value.phone
  };

  databaseRepository.updateUser(req.username.value, user).then((doc) => {
    if (doc.nModified === 0) {
      res.status(404).send(
        { message: 'User not found' }
      );
    } else {
      res.status(204).send(
        { message: 'User updated correctly' }
      );
    }
  }).catch((err) => {
    if (err.status && err.message) {
      res.status(err.status).send({ err: err.message });
    }
    res.status(500).send({ err });
  });
};

module.exports.getProfile = function getProfile (req, res, next) {
  databaseRepository.getUser(req.username.value).then((doc) => {
    if (doc === null || doc === undefined || doc.length === 0) {
      res.status(404).send({ err: 'User not found' });
    } else {
      let products = [];
      let reviews = [];
      let authoredReviews = [];

      const productsPromise = new Promise((resolve, reject) => {
        microservicesRepository.getUserProducts(req.username.value).then(axiosObject => {
          products = axiosObject.data;
          resolve();
        }).catch(err => {
          if (err.message.includes('404')) {
            console.log('Products request - 404');
          } else {
            console.log(err);
          }
          resolve();
        });
      });

      const reviewsPromise = new Promise((resolve, reject) => {
        microservicesRepository.getUserReviews(req.username.value).then(axiosObject => {
          reviews = axiosObject.data;
          resolve();
        }).catch(err => {
          if (err.message.includes('404')) {
            console.log('Reviews request - 404');
          } else {
            console.log(err);
          }
          resolve();
        });
      });

      const authoredReviewsPromise = new Promise((resolve, reject) => {
        microservicesRepository.getAuthorReviews(req.username.value).then(axiosObject => {
          authoredReviews = axiosObject.data;
          resolve();
        }).catch(err => {
          if (err.message.includes('404')) {
            console.log('Authored reviews request - 404');
          } else {
            console.log(err);
          }
          resolve();
        });
      });

      Promise.all([productsPromise, reviewsPromise, authoredReviewsPromise]).then(() => {
        const responseObject = JSON.parse(JSON.stringify(doc[0]));
        responseObject.products = [...products];
        responseObject.reviews = {
          reviewsDone: [...authoredReviews],
          reviewsReceived: [...reviews]
        };
        res.status(200).send(responseObject);
      });
    }
  }).catch((err) => {
    if (err.status && err.message) {
      res.status(err.status).send({ err: err.message });
    }
    res.status(500).send({ err });
  });
};
