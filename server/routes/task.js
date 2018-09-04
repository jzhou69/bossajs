var Task = require('../models/task')
var Question = require('../models/question')

module.exports = function(router){
  router.route('/tasks').get(async (req, res, next) => {
    //query db for all tasks
    var tasks = await new Task().fetchAll();
    res.send(tasks);
  })

  router.route('/task').post(async (req, res, next) => {
    // create a task
    await Task.createTask(req.query.taskName);
    next();
  })

  router.route('/task').get(async (req, res, next) => {
    //get info for a task
    var task = await new Task({name: req.query.taskName}).fetch();
    var questions = await new Question({taskId: task.get('id')}).fetchAll();
    res.json({task: task, questions: questions})
    next();
  })

  router.route('/task/update').get(async (req, res, next) => {
    //update settings for task
    var task = await new Task({name: req.query.taskName}).fetch();
    req.query.redundancy && task.set('redundancy', req.query.redundancy);
    req.query.name && task.set('name', req.query.name);
    req.query.presenter && task.set('presenter', req.query.presenter);
    await task.save();
    next();
  })

  router.route('/task/question').post(async (req, res, next) => {
    //add question to task
    var task = await new Task({name: req.query.taskName}).fetch();
    task.addQuestion(res.query.questionContent)
    next();
  })

  router.route('/task/question').delete(async (req, res, next) => {
    //delete question from task
    var question = new Question({id: req.query.questionId}).fetch();
    question.destroy()
    next();
  })

  router.route('/task/answer').post(async (req, res, next) => {
    //record answer for question
    var question = new Question({id: req.query.questionId}).fetch();
    question.recordAnswer(req.query.answer);
    next();
  })
}
