const express = require('express');
const router = express.Router();
const Question = require('../models/question.js');

// GET ROUTES

module.exports = function(passport) {
  router.get('/', (req, res) => {
    console.log(req.user);

    Question.find().exec((err, questions) => {
      if (err) return res.end();
      res.render('all-polls', {
        page_name: 'allPolls',
        title: 'All polls',
        questions: questions,
        user: req.user
      });
    });
  });

  router.get('/new', isLoggedIn, (req, res) => {
    res.render('new-poll', {
      page_name: 'newPoll',
      title: 'Create a new poll',
      user: req.user
    });
  });

  router.get('/poll/:pollId', (req, res) => {
    const pollId = req.params.pollId;

    if (!validId(pollId)) {
      return res.sendStatus(404);
    }

    Question.findOne({'_id': pollId}).exec((err, poll) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      };
      if (poll === null) { // no result
        return res.sendStatus(404);
      }
      res.render('single-poll', {
        page_name: 'singlePoll',
        title: poll.question,
        poll: poll,
        user: req.user
      });
    });
  });

  // POST ROUTES

  router.post('/api/save-new-poll', isLoggedIn, (req, res) => {
    const questionText = req.body.question;
    let options = req.body.options.split('\r\n');

    options = options.filter(option => {
      return option.trim() !== ''
    });
    if (options.length < 2 || questionText === '') {
      return res.redirect('/');
    }

    const question = new Question({
      question: questionText,
      options: options.map(label => {
        return {
          label: label
        }
      }),
      author: req.user._id
    });

    question.save(err => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
    }).then(data => {
      res.redirect('/poll/' + data['_id']);
    });
  });

  router.post('/api/poll/:pollId', (req, res) => {
    const pollId = req.params.pollId;
    const optionId = req.body.option;

    if (!validId(pollId) || !validId(optionId)) {
      return res.sendStatus(404);
    }

    // Update Poll
    Question.findOneAndUpdate(
      { "_id": pollId, "options._id": optionId },
      {
          "$inc": {
              "options.$.votes": 1
          }
      },
      (err) => {
        if (err) {
          console.error(err)
          return res.sendStatus(500);
        }
      }
    );

    res.redirect('/poll/' + pollId);
  });

  function validId(pollId) {
    return pollId.match(/^[0-9a-f]{24}$/i);
  }

  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
      return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/users/login');
  }

  return router;

}
