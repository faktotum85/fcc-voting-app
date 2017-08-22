const express = require('express');
const session = require('express-session');
const engine = require('express-ejs-layouts');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const port = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');
app.use(engine);
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

require('./config/passport')(passport); // pass passport for configuration

app.use(session({
  secret: 'is safe with me',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// ROUTES
const appRoutes = require('./app/routes/router')(passport);
const userRoutes = require('./app/routes/users')(passport);
app.use('/', appRoutes);
app.use('/users/', userRoutes);

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
