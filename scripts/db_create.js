var config = {
  client: 'postgresql',
  connection: 'postgres://postgres:password@localhost:5432/bossa',
  debug: false
}
var knex = require('knex')(config);

knex.schema.createTable('tasks', function(table){
  table.increments('id').primary();
  table.string('name');
  table.text('presenter','longtext');
  table.integer('redundancy');
  table.integer('userId');
  table.boolean('isPublished');
  table.time('createdAt');
  table.time('updatedAt');
  table.unique('name');
}).then(function(){
  return knex.schema.createTable('questions', function(table){
    table.increments('id').primary();
    table.integer('taskId');
    table.jsonb('content');
    table.text('answer', 'longtext');
    table.integer('answererId');
    table.time('updatedAt');
    table.time('createdAt');
  })
}).then(function(){
  return knex.schema.createTable('users', function(table){
    table.increments('id').primary();
    table.string('username');
    table.string('password');
    table.integer('privilege');
    table.time('createdAt');
    table.time('updatedAt');
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
