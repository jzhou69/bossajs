# BossaJS

BossaJS is an application for creating tasks. Features:
* create tasks
* specify task presenter
* load questions
* answer questions
* export answers
* user authorization

To run the backend server, first create the database with `node scripts/db_create.js`. Then run `node server/index.js`. Due to the way this app uses cookies, please only run one instance of the server.

To run the frontend server, `npm run start`.

For example presenter and questions format, check the /examples folder.
