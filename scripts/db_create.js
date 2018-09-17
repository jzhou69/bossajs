var knex = require('../server/config/database').knex

knex.schema.createTable('tasks', function(table){
  table.increments('id').primary();
  table.string('name');
  table.text('presenter','longtext');
  table.integer('redundancy');
  table.unique('name');
}).then(function(){
  return knex.schema.createTable('questions', function(table){
    table.increments('id').primary();
    table.integer('taskId');
    table.json('content');
    table.text('answer', 'longtext');
  })
}).then(function(){
  return knex.schema.createTable('users', function(table){
    table.increments('id').primary();
    table.string('username');
    table.string('password');
    table.integer('privilege');
    table.unique('username');
  })
}).then(function(){
  console.log('successfully created tables');
  process.exit();
}).catch(function(err){
  console.log('failed to create tables:');
  console.log(err);
  process.exit();
})
