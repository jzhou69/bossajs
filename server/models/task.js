var sequelize = require('./../config/database').sequelize;
var Sequelize = require('sequelize');
var Question = require('./question');

var Task = sequelize.define('tasks', {
  name: Sequelize.STRING,
  presenter: Sequelize.STRING,
  redundancy: Sequelize.INTEGER
})

Task.createTask = function(name){
  return Task.create({
    name: name,
    redundancy: 1,
    presenter: ''
  })
}

Task.prototype.addQuestion = function(content){
  var task = this;
  Question.createQuestion(task.get('id'), content)
}

module.exports = Task
