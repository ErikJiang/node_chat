var crypto = require('crypto');
var usersRouter = require('./users');
var userApi = require('../models/users.server.api');

module.exports = function(app) {
	/* GET home page. */
	app.get('/', function(req, res, next) {
		if (req.session.user == null) {
			res.redirect('/signin');
		}
		else {
			res.render('index', {
				user: req.session.user
			});	
		}
	});

	/* Get signin page. */
	app.get('/signin', function(req, res, next) {
		res.render('signin');
	});

	/* Post signin request. */
	app.post('/signin', function(req, res, next) {
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		userApi.findOneUser(req.body.username, function(err, user){
			if(err) {
				console.log('signin find user fail. ', err);
				return res.send('find user fail.');
			}
			if ((user == null) || (user.password != password)) {
				res.send('username or password is wrong.');
			}
			else {
				userApi.updateStatus(req.body.username, 1, function(err) {
					if(err) {
						console.log('signin update user status fail. ', err);
						return res.send('update user status fail.');
					}
					req.session.user = {
						username: user.username,
						_id: user._id
					};
					res.redirect('/');
				});
			}
		});
	});

	/* Get signup page. */
	app.get('/signup', function(req, res, next) {
		res.render('signup');
	});

	/* Post signup request. */
	app.post('/signup', function(req, res, next) {
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');

		if(req.body.password != req.body.confirm) {
			return res.send('signup user password unmatch.');
		}
		userApi.addNewUser(req.body.username, password, function(err) {
			if(err) {
				console.log('add new user fail. ', err);
				return res.send('add new user fail.');
			}
			res.redirect('/signin');
		});
	});

	/* users router */
	usersRouter(app);
};

