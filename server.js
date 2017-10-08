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
// basic route ----------
app.get('/', function(req, res) {
	res.send('Hello The API is at http://localhost:' + port + '/api');
});

app.get('/setup', function(req, res){

	var john = new User({
		name: 'John Doe',
		password: 'johndoe',
		admin: true
	});

	john.save(function(err){
		if (err) throw err;

		console.log('User saved');
		res.json({ success: true });
	});
});
// API ROUTES
// =====================
// all routes -----------

var apiRoutes = express.Router();
//Autheticate Route:------------

//Verify Token Route:-----------

//api message route: -----------
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Restful API'});
});

//Return all users: --------
apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

//Prefix routes with /api ----
app.use('/api', apiRoutes);

// Authenticate Routes
// =====================
// POST routes ----------

apiRoutes.post('/authenticate', function(req, res) {

	//find a user
	User.findOne({
		name: req.body.name
	}, function(err, user){
		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. USER NOT FOUND'})
		} else if (user) {
			if (user.password != req.body.password ) {
				res.json({ success: false, message: 'Authentication failed!'});
			}

			else {
				//user is found
				//create token

				const payload = {
					admin: user.admin
				};

				var token = jwt.sign(payload, app.get('superSecret'), {
					expiresIn: '24h' // 24 hour expiry
				});

				//get info and token as json

				res.json({
					success: true,
					message: 'Tokenized user!',
					token: token
				});
			}
		}
	});
});


// =====================
// start server
// =====================
app.listen(port);
console.log('Finally http://localhost:' + port);