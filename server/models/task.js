var sequelize = require('./../config/database').sequelize;
var Sequelize = require('sequelize');
var Question = require('./question');

var Task = sequelize.define('tasks', {
  name: Sequelize.STRING,
  presenter: Sequelize.STRING,
  redundancy: Sequelize.INTEGER,
  userId: Sequelize.INTEGER,
  isPublished: Sequelize.BOOLEAN
})

Task.createTask = function(name, userId){
  return Task.create({
    name: name,
    redundancy: 1,
    presenter: '',
    userId: userId,
    isPublished: false
  })
}

Task.prototype.addQuestion = function(content){
  var task = this;
  Question.createQuestion(task.get('id'), content)
}

module.exports = Task
