var Task = require('../models/task')
var Question = require('../models/question')
var fs = require('fs')

module.exports = function(router){
  router.route('/tasks').get(async (req, res, next) => {
    // fetches all tasks
    var tasks = await Task.fetchAll();
    res.send(tasks);
  })

  router.route('/task').post(async (req, res, next) => {
    // create a new task with specified name
    // TODO: enforce unique name
    var task = await Task.createTask(req.query.taskName);
    res.send(task)
  })

  router.route('/task').get(async (req, res, next) => {
    // get info for a task
    var task = await Task.where({id: req.query.taskId}).fetch();
    var total = await Question.query({where: {taskId: req.query.taskId}}).count()
    var completed = await Question.query({where: {taskId: req.query.taskId}}).count('answer')
    res.send(Object.assign(task.toJSON(), {
      completion: `${completed}/${total}`,
      completed: total == completed && total != 0
    }))
  })

  router.route('/task/update').post(async (req, res, next) => {
    //update settings for task
    var task = await Task.where({id: req.query.taskId}).fetch();
    //req.query.redundancy && task.set('redundancy', req.query.redundancy);
    //req.query.name && task.set('name', req.query.name);
    req.query.presenter && task.set('presenter', req.query.presenter);
    await task.save().catch((err) => {
      console.log(err);
    })
    res.send(task);
  })

  router.route('/task/question').get(async (req, res, next) => {
    //get an unanswered question
    var task = await Task.where({id: req.query.taskId}).fetch();
    var question = await Question.query((qb) => {
      qb.where('taskId', '=', req.query.taskId).andWhere('answer', null)
    }).fetch();
    if(question){
      res.send(Object.assign(question.toJSON(), {
        presenter: task.get('presenter')
      }));
    } else {
      res.send({
        done: true
      });
    }
  })

  router.route('/task/question/string').post(async (req, res, next) => {
    //add question to task in the form of a string
    var task = await Task.where({id: req.query.taskId}).fetch();
    var questions = JSON.parse(req.query.questions)
    questions.forEach((question) => {
      task.addQuestion(question);
    })
    res.send(task);
  })

  router.route('/task/question').delete(async (req, res, next) => {
    //delete question from task
    var question = await Question.where({id: req.query.questionId}).fetch();
    question.destroy()
    res.sendStatus(200);
  })

  router.route('/task/question/answer').post(async (req, res, next) => {
    //record answer for question
    var question = await Question.where({id: req.query.questionId}).fetch();
    question.recordAnswer(req.query.answer).then(() => {
      res.sendStatus(200);
    }).catch(() => {
      // TODO: deal with multiple people trying to answer a question
      res.sendStatus(409);
    })
  })

  router.route('/task/export').get(async (req, res, next) => {
    //export answers for all questions
    var questions = await Question.where({taskId: req.query.taskId}).fetchAll();
    var content = questions.map(question => question.get('answer'));
    content.filter(n => n); // filter out undefined entries
    content = content.join('\n');
    res.send(content);
    /*var fileName = __dirname + '/test.txt';
    fs.writeFile(fileName, content, 'utf8', function(err){
      if (err){
        console.log(err)
      }
      res.sendFile(fileName);
    });*/
  })
}
