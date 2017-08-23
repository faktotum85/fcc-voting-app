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
}

exports.delete = (req, res) => {
  const pollId = req.params.pollId;

  if (!validId(pollId)) {
    return res.sendStatus(404);
  }

  // Delete poll
  Question.remove(
    { '_id': pollId,
      'author': req.user._id
    },
    (err) => {
      if (err) {
        console.error(err)
        return res.sendStatus(500);
      }
    }
  );

  res.redirect('/dashboard');
};
