var bookshelf = require('./../config/database').bookshelf;
var Question = require('./question')
var Model = bookshelf.model.prototype

var Task = bookshelf.Model.extend({
  tableName: 'tasks',
  addQuestion: function(content){
    var task = this;
    Question.createQuestion(task.get('id'), content)
  }
}, {
  createTask: function(name){
    var task = new Task({
      name: name,
      redundancy: 1,
      presenter: ''
    })
    task.save().then(() => {
      return task;
    })
  }
})

module.exports = bookshelf.model('Task', Task);
