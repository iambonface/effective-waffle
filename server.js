// =====================
// get all packages
// =====================

var  express 	= require('express');
var  app 		= express();
var  bodyParser = require('body-parser');
var  jwt 		= require('jsonwebtoken');
var  morgan 	= require('morgan');
var  mongoose	= require('mongoose');

var config 		= require('./config');
var User		= require('./backend/models/user');

// =====================
// configuration
// =====================

var port = process.env.PORT || 8080; 
mongoose.connect(config.database);
app.set('superSecret', config.secret);

// =====================
// get info from POST and URL params
// =====================

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// =====================
// log requestes to console
// =====================

app.use(morgan('dev'));


// =====================
// routes
// =====================
// vasic route ----------
app.get('/', function(req, res) {
	res.send('Hello The API is at http://localhost:' + port + '/api');
});

// API ROUTES
// =====================
// all route -----------


// =====================
// start server
// =====================
app.listen(port);
console.log('Finally http://localhost:' + port);