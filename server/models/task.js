var bookshelf = require('./../config/database').bookshelf;
var Question = require('./question')
var Model = bookshelf.model.prototype

var Task = bookshelf.Model.extend({
  tableName: 'tasks',
  addQuestion: function(contentString){
    var task = this;
    Question.createQuestion(task.get('id'), contentString)
  }
}, {
  createTask: function(name){
    var task = new Task({
      name: name,
      redundancy: 1,
      presenter: ''
    })
    return task.save()
  }
})

module.exports = bookshelf.model('Task', Task);
