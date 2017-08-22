const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/user');

module.exports = function (passport) {
  passport.use('local-signup', new LocalStrategy({
    passReqToCallback : true
  },(req, username, password, done) => {
    User.findOne({username: username}, (err, user) => {
      if (err) return done(err);
      if (user) {
        return done(null, false, req.flash('signupMessage', 'Username already taken'));
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

  passport.use('local-login', new LocalStrategy({
    passReqToCallback : true
  }, (req, username, password, done) => {
    User.findOne({username: username}, (err, user) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'Username not found'));
      }
      if (user.password !== password) {
        return done(null, false, req.flash('loginMessage', 'Incorrect password'));
      }
      return done(null, user);
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
