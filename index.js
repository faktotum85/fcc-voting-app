const express = require('express');
const engine = require('express-ejs-layouts');
const morgan = require('morgan');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.use(engine);
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.render('all-polls', {
    page_name: 'allPolls',
    title: 'All polls'
  });
});

app.get('/new', (req, res) => {
  res.render('new-poll', {
    page_name: 'newPoll',
    title: 'Create a new poll'
  });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/votingapp', {
  useMongoClient: true
}).then(
  () => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  },
  err => {
    throw err;
  }
);
