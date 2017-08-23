exports.signup = (req, res) => {
  res.render('signup', {
    page_name: 'signup',
    title: 'Sign up',
    user: req.user,
    message: req.flash('signupMessage')
  });
};

exports.login = (req, res) => {
  res.render('login', {
    page_name: 'login',
    title: 'Log in',
    user: req.user,
    message: req.flash('loginMessage')
  });
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};
