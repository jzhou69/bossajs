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

/*
 * creates a new task with the same task presenter
 * the questions are the questions which had different redundant answers
 * the questions will have an additional field on the content JSONB to indicate who provided which answer
*/
Task.prototype.createResolveRedundancyTask = async function(){
  var oldTask = this;
  var newTask = await Task.create({
    name: oldTask.get('name') + '_redundancy_QA',
    redundancy: 1,
    presenter: oldTask.get('presenter'),
    userId: oldTask.get('userId'),
    isPublished: true
  });
  var questions = await Question.findAll({ where: {taskId: oldTask.get('id')} });
  questions.forEach((question) => {
    ans = question.get('answer');
    for(let i=0; i<Object.values(ans).length; i++){
      if(Object.values(ans)[i] != Object.values(ans)[0]){
        // create new question
        let newContent = question.get('content');
        newContent.answers = {};
        Object.keys(ans).forEach((ind) => {
          newContent.answers[ind] = ans[ind]
        })
        Question.createQuestion(newTask.get('id'), newContent);
        break;
      }
    }
  })
  return newTask;
}

module.exports = Task
