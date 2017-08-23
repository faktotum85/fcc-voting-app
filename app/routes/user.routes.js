const express = require('express');
const userCtrl = require('../controllers/user.controller');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// route middleware to make sure a user is NOT logged in
function notLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

const router = express.Router();

module.exports = function(passport) {
  router.get('/signup', notLoggedIn, userCtrl.signup);

  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/users/signup'
  }));

  router.get('/login', notLoggedIn, userCtrl.login);

  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login'
  }));

  router.get('/logout', userCtrl.logout);

  return router;
}
