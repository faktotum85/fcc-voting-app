const express = require('express');
const session = require('express-session');
const engine = require('express-ejs-layouts');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./app/models/user');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const port = process.env.PORT || 8080;
const app = express();

passport.use('local-signup', new LocalStrategy((username, password, done) => {
  User.findOne({username: username}, (err, user) => {
    if (err) return done(err);
    if (user) {
      return done(null, false, { message: 'Username already taken'});
    }
    const newUser = new User();
    newUser.username = username;
    newUser.password = password;
    newUser.save((err) => {
      if (err) throw err;
      return done(null, newUser);
    });
  });
}));

passport.use('local-login', new LocalStrategy((username, password, done) => {
  User.findOne({username: username}, (err, user) => {
    if (err) return done(err);
    if (!user) {
      return done(null, false, { message: 'Username not found'});
    }
    if (!user.password === password) {
      return done(null, false, { message: 'Incorrect password'});
    }
    return done(null, user);
  });
}));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'is safe with me',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.set('view engine', 'ejs');
app.use(engine);
app.use(morgan('dev'));

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
