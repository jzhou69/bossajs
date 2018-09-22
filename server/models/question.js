var sequelize = require('./../config/database').sequelize;
var Sequelize = require('sequelize');

var Question = sequelize.define('questions', {
  taskId: Sequelize.INTEGER,
  content: Sequelize.JSONB,
  answer: Sequelize.JSONB,
  answerCount: Sequelize.INTEGER
})

Question.createQuestion = function(taskId, content){
  return Question.create({
    taskId: taskId,
    content: content,
    answer: {},
    answerCount: 0
  });
}

Question.prototype.recordAnswer = function(answerString, userId){
  var question = this;
  question.answer['' + userId] = answerString;
  question.changed('answer', true);
  question.answerCount = question.get('answerCount') + 1;
  return question.save();
}

module.exports = Question;
