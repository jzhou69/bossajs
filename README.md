# BossaJS

BossaJS is an application for creating tasks. Features:
* create tasks
* specify task presenter
* load questions
* answer questions
* export answers
* user authorization

To run the backend server, first create the database with `node scripts/db_create.js`. Then run `forever start server/index.js`.

To run the frontend server, `npm run start`.

For example presenter and questions format, check the /examples folder.
