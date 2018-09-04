var knex = require('../server/config/database').knex

knex.schema.createTable('tasks', function(table){
  table.increments('id').primary();
  table.string('name')
  table.text('presenter','longtext')
  table.integer('redundancy');
  table.boolean('completed')
}).then(function(){
  return knex.schema.createTable('questions', function(table){
    table.increments('id').primary();
    table.integer('taskId');
    table.json('content');
    table.string('answer');
  })
}).then(function(){
  return knex.schema.createTable('users', function(table){
    table.increments('id').primary();
    table.string('username');
    table.string('password');
    table.integer('privilege');
  })
}).then(function(){
  console.log('successfully created tables');
  process.exit();
}).catch(function(err){
  console.log('failed to create tables:');
  console.log(err);
  process.exit();
})
