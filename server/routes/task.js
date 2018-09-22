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
    var tasks = await Task.findAll({where: {isPublished: true}});
    res.send(tasks);
  })

  router.route('/task').post(authorize(privilege['REVIEWER']), (req, res) => {
    // create a new task with specified name
    Task.createTask(req.query.taskName, req.user.get('id')).then((task) => {
      res.send(task);
    }).catch((err) => {
      if(err.parent.code == '23505'){
        return res.status(422).send('A task with that name already exists.');
      }
      res.sendStatus(500);
    })
  })

  router.route('/task/publish').post(authorize(privilege['REVIEWER']), async (req, res) => {
    // publish a task
    var task = await Task.findById(req.query.taskId);
    if(task.get('userId') != req.user.get('id')){
      res.status(401).send('Cannot publish another user\'s task');
    }
    await task.update({isPublished: true});
    res.sendStatus(200);
  })

  router.route('/task').get(async (req, res) => {
    // get info for a task
    var task = await Task.findById(req.query.taskId);
    var total = await Question.count({where: {taskId: req.query.taskId}});
    var completed = await Question.count({where: {taskId: req.query.taskId, answerCount: {[Op.gte]: task.get('redundancy')}}});
    res.send(Object.assign(task.toJSON(), {
      completion: `${completed}/${total}`,
      completed: total == completed && total != 0
    }))
  })

  router.route('/task/update').post(authorize(privilege['REVIEWER']), async (req, res) => {
    //update settings for task
    var task = await Task.findById(req.query.taskId);
    req.query.redundancy && (task.redundancy = parseInt(req.query.redundancy));
    req.query.presenter && (task.presenter = req.query.presenter);
    await task.save();
    res.sendStatus(200);
  })

  router.route('/task/question').get(authorize(privilege['CONTRIBUTOR']), async (req, res) => {
    //get an unanswered question
    var task = await Task.findById(req.query.taskId);
    var queryObject = {
      taskId: req.query.taskId,
      answerCount: {[Op.lt]: task.get('redundancy')},
    }
    queryObject['answer.' + req.user.get('id')] = null;
    var question = await Question.findOne({where: queryObject});
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

  router.route('/task/question/answer').post(authorize(privilege['CONTRIBUTOR']), async (req, res) => {
    //record answer for question
    var question = await Question.findById(req.query.questionId);
    question.recordAnswer(req.query.answer, req.user.get('id')).then(() => {
      res.sendStatus(200);
    }).catch(() => {
      // TODO: deal with multiple people trying to answer a question
      res.status(409).send('Question already has the maximum number of answers.');
    })
  })

  router.route('/task/export').get(async (req, res) => {
    //export answers for all questions
    var questions = await Question.findAll({ where: {taskId: req.query.taskId} });
    var errors = 0;
    var answers = questions.reduce((rv, question) => {
      ans = question.get('answer');
      Object.keys(ans).forEach((ind) => {
        rv.push('' + ind + ': ' + ans[ind]);
      })
      for(let i=0; i<Object.values(ans).length; i++){
        if(Object.values(ans)[i] != Object.values(ans)[0]){
          errors++;
          break;
        }
      }
      return rv;
    }, [])
    answers.unshift('Redundancy errors: ' + errors);
    content = answers.join('\n');
    res.send(content);
    /*var fileName = __dirname + '/test.txt';
    fs.writeFile(fileName, content, 'utf8', function(err){
      if (err){
        console.log(err)
      }
      res.sendFile(fileName);
    });*/
  })

  router.route('/task/redundancyqa').post(authorize(privilege['REVIEWER']), async (req, res) => {
    // creates redundancy qa task
    var task = await Task.findById(req.query.id);
    if(task.get('userId') != req.user.get('id')){
      res.status(401).send('You must be the creator of this task to perform that operation.');
    }
    var newTask = await task.createResolveRedundancyTask().catch(() => {
      res.status(422).send('Could not create task. This could be because a redundancy QA task already exists.');
    })
    res.send(newTask);
  })
}
