var Sequelize = require('sequelize');

var sequelize = new Sequelize('postgres://postgres:password@localhost:5432/bossa', {
  logging: false,
  operatorsAliases: false
});

module.exports.sequelize = sequelize;
