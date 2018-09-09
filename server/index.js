var express = require('express');
var routes = require('./routes/');
var cors = require('cors');

var app = express();
var router = express.Router();
routes(router);

app.use(cors({credentials: true, origin: true}));
require('./config/auth')(app);
app.use('/api', router);

const port = 5000;
app.listen(port, function(){
    console.log('Server started on port ' + port);
});
