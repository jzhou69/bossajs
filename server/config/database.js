var config = {
  client: 'postgresql',
  connection: 'postgres://postgres:password@localhost:5432/bossa',
  debug: false
}

var knex = require('knex')(config);
module.exports.knex = knex;
var bookshelf = require('bookshelf')(knex);

bookshelf.plugin('registry');
bookshelf.plugin('virtuals')

module.exports.bookshelf = bookshelf;
