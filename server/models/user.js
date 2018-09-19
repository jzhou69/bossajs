var sequelize = require('./../config/database').sequelize;
var Sequelize = require('sequelize');
var crypto = require('crypto');

const salt = 'rjetw'
const privileges = {
  'ADMIN': 1,
  'REVIEWER': 2,
  'CONTRIBUTOR': 3
}

var User = sequelize.define('users', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  privilege: Sequelize.INTEGER
})

User.privileges = privileges;
User.createUser = function(username, password, privilege){
  if(!Object.values(privileges).includes(privilege)){
    privilege = privileges['CONTRIBUTOR'];
  }
  return User.create({
    username: username,
    password: crypto.createHmac('sha256', salt).update(password).digest('hex'),
    privilege: privilege
  });
}

User.prototype.verifyPassword = function(password){
  return this.get('password') == crypto.createHmac('sha256', salt).update(password).digest('hex');
}

module.exports = User
