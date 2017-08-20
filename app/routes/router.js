const express = require('express');
const router = express.Router();
const Question = require('../models/question.js');

router.get('/', (req, res) => {

  Question.find().exec((err, questions) => {
    if (err) return res.end();
    res.render('all-polls', {
      page_name: 'allPolls',
      title: 'All polls',
      questions: questions
    });
  });
});

router.get('/new', (req, res) => {
  res.render('new-poll', {
    page_name: 'newPoll',
    title: 'Create a new poll'
  });
});

module.exports = router;
