var Task = require('../models/task')
var Question = require('../models/question')
var fs = require('fs')
const privilege = require('../models/user').privileges

function authorize(level){
  return function(req, res, next){
    if(!req.user){
      return res.sendStatus(401);
    }
    if(req.user.get('privilege') > level){
      return res.sendStatus(401);
    }
    next()
  }
}

module.exports = function(router){
  router.route('/tasks').get(async (req, res) => {
    // fetches all tasks
    var tasks = await Task.fetchAll();
    res.send(tasks);
  })

  router.route('/task').post(authorize(privilege['REVIEWER']), async (req, res) => {
    // create a new task with specified name
    // TODO: enforce unique name
    var task = await Task.createTask(req.query.taskName);
    res.send(task)
  })

  router.route('/task').get(async (req, res) => {
    // get info for a task
    var task = await Task.where({id: req.query.taskId}).fetch();
    var total = await Question.query({where: {taskId: req.query.taskId}}).count()
    var completed = await Question.query({where: {taskId: req.query.taskId}}).count('answer')
    res.send(Object.assign(task.toJSON(), {
      completion: `${completed}/${total}`,
      completed: total == completed && total != 0
    }))
  })

  router.route('/task/update').post(authorize(privilege['REVIEWER']), async (req, res) => {
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

  router.route('/task/question').get(async (req, res) => {
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

  router.route('/task/question/string').post(authorize(privilege['REVIEWER']), async (req, res) => {
    //add question to task in the form of a string
    var task = await Task.where({id: req.query.taskId}).fetch();
    var questions = JSON.parse(req.query.questions)
    questions.forEach((question) => {
      task.addQuestion(question);
    })
    res.send(task);
  })

  router.route('/task/question').delete(authorize(privilege['REVIEWER']), async (req, res) => {
    //delete question from task
    var question = await Question.where({id: req.query.questionId}).fetch();
    question.destroy()
    res.sendStatus(200);
  })

  router.route('/task/question/answer').post(authorize(privilege['CONTRIBUTOR']), async (req, res) => {
    //record answer for question
    var question = await Question.where({id: req.query.questionId}).fetch();
    question.recordAnswer(req.query.answer).then(() => {
      res.sendStatus(200);
    }).catch(() => {
      // TODO: deal with multiple people trying to answer a question
      res.sendStatus(409);
    })
  })

  router.route('/task/export').get(async (req, res) => {
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
