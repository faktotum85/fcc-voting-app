const express = require('express');
const engine = require('express-ejs-layouts');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.use(engine);
app.use(morgan('dev'));

// ROUTES
app.use('/', require('./app/routes/router'));
app.use('/api/', require('./app/routes/api'));

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
