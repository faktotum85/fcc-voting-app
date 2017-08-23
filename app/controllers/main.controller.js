const Question = require('../models/question.js');

function validId(pollId) {
  return pollId.match(/^[0-9a-f]{24}$/i);
}

exports.home = (req, res) => {

  Question.find().exec((err, questions) => {
    if (err) return res.end();
    res.render('poll-list', {
      page_name: 'allPolls',
      title: 'All polls',
      questions: questions,
      user: req.user
    });
  });
};

exports.dashboard = (req, res) => {
  Question.find({
    author: req.user._id
  }).exec((err, questions) => {
    if (err) return res.end();
    res.render('poll-list', {
      page_name: 'myPolls',
      title: 'My polls',
      questions: questions,
      user: req.user
    });
  });
};

exports.new = (req, res) => {
  res.render('new-poll', {
    page_name: 'newPoll',
    title: 'Create a new poll',
    user: req.user
  });
};

exports.poll = (req, res) => {
  res.render('single-poll', {
    page_name: 'singlePoll',
    title: req.poll.question,
    poll: req.poll,
    user: req.user
  });
};

exports.savePoll = (req, res) => {
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
};

exports.vote = (req, res) => {
  const optionId = req.body.option;

  // Update Poll
  Question.findOneAndUpdate(
    { "_id": req.poll.id, "options._id": optionId },
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

  res.redirect('/poll/' + req.poll.id);
}

exports.delete = (req, res) => {
  req.poll.remove((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/dashboard');
  });
};

exports.pollById = (req, res, next, id) => {
  Question.findOne({
    _id: id
  }, (err, poll) => {
    if (err) {
      return next(err);
    }
    req.poll = poll;
    next();
  });
};
