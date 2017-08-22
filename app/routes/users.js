const express = require('express');
const router = express.Router();

module.exports = function(passport) {
  // AUTH
  router.get('/signup', notLoggedIn, (req, res) => {
    res.render('signup', {
      page_name: 'signup',
      title: 'Sign up',
      user: req.user
    });
  });

  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/users/signup'
  }));

  router.get('/login', notLoggedIn, (req, res) => {
    res.render('login', {
      page_name: 'login',
      title: 'Log in',
      user: req.user
    });
  });

  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  }));

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });


  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
      return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
  }

  // route middleware to make sure a user is NOT logged in
  function notLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
      return res.redirect('/');
    }

    next();
  }

  return router;
}
