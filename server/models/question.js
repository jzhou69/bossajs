var bookshelf = require('./../config/database').bookshelf;

var Question = bookshelf.Model.extend({
  tableName: 'questions',
  recordAnswer: function(answerString){
    var question = this;
    if(question.get('answer')){
      return Promise.reject();
    }
    question.set('answer', answerString);
    return question.save();
  }
}, {
  createQuestion: function(taskId, content){
    var question = new Question({
      taskId: taskId,
      content: content
    });
    return question.save()
  }
})

module.exports = bookshelf.model('Question', Question);
