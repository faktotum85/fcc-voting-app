const express = require('express');
const router = express.Router();
const Question = require('../models/question.js');

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
