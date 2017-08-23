const express = require('express');
const mainCtrl = require('../controllers/main.controller.js');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

const router = express.Router();

module.exports = function(passport) {
  // GET ROUTES
  router.get('/', mainCtrl.home);

  router.get('/dashboard', isLoggedIn, mainCtrl.dashboard);

  router.get('/new', isLoggedIn, mainCtrl.new);

  router.get('/poll/:pollId', mainCtrl.poll);

  // POST ROUTES
  router.post('/api/save-new-poll', isLoggedIn, mainCtrl.savePoll);

  router.post('/api/vote/:pollId', mainCtrl.vote);

  router.post('/api/delete/:pollId', mainCtrl.delete);

  router.param('pollId', mainCtrl.pollById);

  return router;

}
