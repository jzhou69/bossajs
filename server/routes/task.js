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
    var task = await Task.createTask(req.query.taskName);
    res.send(task)
  })

  router.route('/task').get(async (req, res, next) => {
    //get info for a task
    var task = await new Task({id: req.query.taskId}).fetch();
    /*var questions = await new Question({taskId: req.query.taskId}).fetchAll();
    var completedQuestions = await new Question({taskId: req.query.taskId}).fetchAll();
    res.send({
      id: task.get('id'),
      name: task.get('name'),
      presenter: task.get('presenter'),
      redundancy: task.get('redundancy'),
      completion: ''
    })*/
    res.send(task)
  })

  router.route('/task/update').post(async (req, res, next) => {
    //update settings for task
    var task = await new Task({id: req.query.taskId}).fetch();
    req.query.redundancy && task.set('redundancy', req.query.redundancy);
    req.query.name && task.set('name', req.query.name);
    req.query.presenter && task.set('presenter', req.query.presenter);
    await task.save().catch((err) => {
      console.log(err)
    })
    res.send(task);
  })

  router.route('/task/question').get(async (req, res, next) => {
    //add question to task
    var task = await new Task({id: req.query.taskId}).fetch();
    var question = await Question.query((qb) => {
      qb.where('taskId', '=', req.query.taskId).andWhere('answer', null)
    }).fetch();
    res.send(Object.assign(question.toJSON(), {
      presenter: task.get('presenter')
    }));
  })

  router.route('/task/question/string').post(async (req, res, next) => {
    //add question to task in the form of a string
    var task = await new Task({id: req.query.taskId}).fetch();
    task.addQuestion(JSON.parse(req.query.questionContent))
    res.sendStatus(200);
  })

  router.route('/task/question').delete(async (req, res, next) => {
    //delete question from task
    var question = await new Question({id: req.query.questionId}).fetch();
    question.destroy()
    res.sendStatus(200);
  })

  router.route('/task/question/answer').post(async (req, res, next) => {
    //record answer for question
    var question = await new Question({id: req.query.questionId}).fetch();
    question.recordAnswer(req.query.answer).then(() => {
      res.sendStatus(200);
    }).catch(() => {
      // multiple people tried to answer a question
      res.sendStatus(409);
    })
  })
}
