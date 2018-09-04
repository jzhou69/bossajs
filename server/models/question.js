var bookshelf = require('./../config/database').bookshelf;

var Question = bookshelf.Model.extend({
  tableName: 'questions',
  recordAnswer: function(answerString){
    var question = this;
    question.set('answer', answerString);
    return question.save();
  }
}, {
  createQuestion: function(taskId, contentString){
    var question = new Question({
      taskId: taskId,
      content: contentString
    });
    return question.save()
  }
})

module.exports = bookshelf.model('Question', Question);
