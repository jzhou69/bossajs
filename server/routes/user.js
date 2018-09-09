var User = require('../models/user')
var passport = require('passport')

module.exports = function(router){
  router.route('/users').get(async (req, res) => {
    // fetches all users
    var users = await User.fetchAll();
    res.send(users);
  })

  router.route('/user/create').post(async (req, res) => {
    // create a new user
    User.createUser(req.query.username, req.query.password, Number(req.query.privilege));
    res.sendStatus(200);
  })

  router.route('/user/authenticate').post(async (req, res, next) => {
    // create a new user
    passport.authenticate('local', (err, user, info) => {
      if(err){
        return next(err)
      }
      if(!user){
        return res.sendStatus(401);
      }
      req.login(user, function(err) {
        if(err){
          return next(err);
        }
        res.sendStatus(200);
      });
    })(req, res, next)
  })
}
