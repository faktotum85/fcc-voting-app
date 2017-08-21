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

router.post('/save-new-poll', (req, res) => {
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
    options: options
  });

  question.save(err => {
    if (err) throw err;
  }).then(data => {
    console.log(data);
  });
  res.redirect('/');
});

module.exports = router;
