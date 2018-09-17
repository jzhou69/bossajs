var User = require('../models/user')
var passport = require('passport')

module.exports = function(router){
  router.route('/users').get(async (req, res) => {
    // fetches all users
    var users = await User.fetchAll();
    res.send(users);
  })

  router.route('/user/create').post((req, res) => {
    // create a new user
    User.createUser(req.query.username, req.query.password, Number(req.query.privilege)).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      if(err.code == '23505'){
        return res.status(422).send('A user with that username already exists.');
      }
      res.sendStatus(500);
    })
  })

  router.route('/user/authenticate').post(async (req, res, next) => {
    // create a new user
    passport.authenticate('local', (err, user, info) => {
      if(err || !user){
        return res.status(401).send('Authentication failed - check your username and password.');
      }
      req.login(user, function(err) {
        if(err){
          return res.status(401).send('An unknown failure occurred.');
        }
        res.sendStatus(200);
      });
    })(req, res, next)
  })

  router.route('/user/session').post(async (req, res) => {
    // check if user is logged in
    res.send(req.user);
  })
}
