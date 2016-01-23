var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/node_chat');

var user = require('./users.server.model');

/* 寻找一个用户 */
exports.findOneUser = function(username, callback) {
	user.UserModel.findOne({username: username}, function(err, user) {
		if (err) {
			return callback(err);
		}
		callback(null, user);
	});
};

/* 添加新用户 */
exports.addNewUser = function(name, pwd, callback) {
	var userEntity = new user.UserModel({
		username: name,
		password: pwd
	});
	userEntity.save(function(err, data) {
		if(err) {
			return callback(err);
		}
		callback(null, data);
	});
};

/* 获取用户列表 */
exports.getUserList = function(callback) {
	user.UserModel.find({}, function(err, users) {
		if (err) {
			return callback(err);
		}
		callback(null, users);
	});
};
