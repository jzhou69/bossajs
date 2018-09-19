var Task = require('../models/task')
var Question = require('../models/question')
var fs = require('fs')
var Op = require('sequelize').Op;
const privilege = require('../models/user').privileges

function authorize(level){
  return function(req, res, next){
    if(!req.user){
      return res.status(401).send('You must be logged in to perform that operation.');
    }
    if(req.user.get('privilege') > level){
      return res.status(401).send('You do not have permission to perform that operation.')
    }
    next()
  }
}

module.exports = function(router){
  router.route('/tasks').get(async (req, res) => {
    // fetches all tasks
    var tasks = await Task.findAll();
    res.send(tasks);
  })

  router.route('/task').post(authorize(privilege['REVIEWER']), async (req, res) => {
    // create a new task with specified name
    // TODO: enforce unique name
    var task = await Task.createTask(req.query.taskName).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      if(err.code == '23505'){
        return res.status(422).send('A task with that name already exists.');
      }
      res.sendStatus(500);
    })
  })

  router.route('/task').get(async (req, res) => {
    // get info for a task
    var task = await Task.findById(req.query.taskId);
    var total = await Question.count({where: {taskId: req.query.taskId}});
    var completed = await Question.count({where: {taskId: req.query.taskId, answer: {[Op.ne]: null}}});
    res.send(Object.assign(task.toJSON(), {
      completion: `${completed}/${total}`,
      completed: total == completed && total != 0
    }))
  })

  router.route('/task/update').post(authorize(privilege['REVIEWER']), async (req, res) => {
    //update settings for task
    var task = await Task.findById(req.query.taskId);
    //req.query.redundancy && task.set('redundancy', req.query.redundancy);
    //req.query.name && task.set('name', req.query.name);
    req.query.presenter && task.set('presenter', req.query.presenter);
    await task.save()
    res.sendStatus(200);
  })

  router.route('/task/question').get(authorize(privilege['CONTRIBUTOR']), async (req, res) => {
    //get an unanswered question
    var task = await Task.findById(req.query.taskId);
    var question = await Question.findOne({where: {taskId: req.query.taskId, answer: null}});
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

  router.route('/task/question/string').post(authorize(privilege['REVIEWER']), async (req, res) => {
    //add question to task in the form of a string
    var task = await Task.findById(req.query.taskId);
    var questions = JSON.parse(req.query.questions)
    questions.forEach((question) => {
      task.addQuestion(question);
    })
    res.sendStatus(200);
  })

  router.route('/task/question/noauth').post(async (req, res) => {
    //this is the same as /task/question/string, except it requires no auth; used for programmatically adding questions
    var task = await Task.findById(req.query.taskId);
    var questions = JSON.parse(req.query.questions)
    questions.forEach((question) => {
      task.addQuestion(question);
    })
    res.sendStatus(200);
  })

  router.route('/task/question').delete(authorize(privilege['REVIEWER']), async (req, res) => {
    //delete question from task
    var question = await Question.findById(req.query.questionId);
    question.destroy()
    res.sendStatus(200);
  })

  router.route('/task/question/answer').post(authorize(privilege['CONTRIBUTOR']), async (req, res) => {
    //record answer for question
    var question = await Question.findById(req.query.questionId);
    question.recordAnswer(req.query.answer).then(() => {
      res.sendStatus(200);
    }).catch(() => {
      // TODO: deal with multiple people trying to answer a question
      res.status(409).send('Question already has the maximum number of answers.');
    })
  })

  router.route('/task/export').get(async (req, res) => {
    //export answers for all questions
    var questions = await Question.findAll({ where: {taskId: req.query.taskId} });
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
