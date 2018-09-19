var sequelize = require('./../config/database').sequelize;
var Sequelize = require('sequelize');

var Question = sequelize.define('questions', {
  taskId: Sequelize.INTEGER,
  content: Sequelize.JSONB,
  answer: Sequelize.STRING,
  answererId: Sequelize.INTEGER
})

Question.createQuestion = function(taskId, content){
  return Question.create({
    taskId: taskId,
    content: content
  });
}

Question.prototype.recordAnswer = function(answerString, userId){
  var question = this;
  if(question.get('answer')){
    return Promise.reject();
  }
  return question.update({answer: answerString, answererId: userId});
}

module.exports = Question;
