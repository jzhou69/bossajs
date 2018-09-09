var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./../models/user')

module.exports = function(app){
  app.use(require('cookie-parser')());
  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('express-session')({ secret: 'hktee', resave: false, saveUninitialized: true, cookie: { maxAge: 1000* 60 * 60 * 24 * 365 }}));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(async (username, password, done) => {
    var user = await User.where({username: username}).fetch();
    if(!user || !user.verifyPassword(password)){
      return done(null, false);
    }
    return done(null, user);
  }));

  passport.serializeUser((user, done) => {
    done(null, user.get('id'));
  });

  passport.deserializeUser((id, done) => {
    User.where({id: id}).fetch().then((user) => {
      done(null, user);
    }).catch((err) => {
      done(err);
    })
  });
};
