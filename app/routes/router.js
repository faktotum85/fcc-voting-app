const express = require('express');
const router = express.Router();
const Question = require('../models/question.js');

router.get('/poll/:pollId', (req, res) => {

  if (!req.params.pollId.match(/^[0-9a-f]{24}$/i)) {
    // invalid id
    return res.sendStatus(404);
  }

  Question.findOne({'_id': req.params.pollId}).exec((err, poll) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    };
    if (poll === null) { // no result
      return res.sendStatus(404);
    }
    console.log(poll);
    res.render('single-poll', {
      page_name: 'singlePoll',
      title: poll.question,
      poll: poll
    });
  });
});

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

router.post('/api/save-new-poll', (req, res) => {
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
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  }).then(data => {
    console.log(data);
    res.redirect('/poll/' + data['_id']);
  });
});

module.exports = router;
