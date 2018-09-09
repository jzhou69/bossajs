var bookshelf = require('./../config/database').bookshelf;
var crypto = require('crypto');
const salt = 'rjetw'

const privileges = {
  'ADMIN': 1,
  'REVIEWER': 2,
  'CONTRIBUTOR': 3
}

var User = bookshelf.Model.extend({
  tableName: 'users',
  verifyPassword: function(password){
    return this.get('password') == crypto.createHmac('sha256', salt).update(password).digest('hex');
  }
}, {
  privileges: privileges,
  createUser: function(username, password, privilege){
    if(!Object.values(privileges).includes(privilege)){
      privilege = privileges['CONTRIBUTOR'];
    }
    var user = new User({
      username: username,
      password: crypto.createHmac('sha256', salt).update(password).digest('hex'),
      privilege: privilege
    });
    return user.save()
  }
})

module.exports = bookshelf.model('User', User);
