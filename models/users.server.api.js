var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/node_chat');

var user = require('./users.server.model');

/* 寻找一个用户(状态未登录) */
exports.findOneUser = function(username, callback) {
	user.UserModel.findOne({
		username: username,
		isonline: 0
	}, function(err, user) {
		if (err) {
			return callback(err);
		}
		callback(null, user);
	});
};

/* 用户状态 online:1 offline:0 */
exports.updateStatus = function(username, stateVal, callback) {
	user.UserModel.update({
		username: username
		}, { 
	 	$set: { isonline: stateVal }
	 	}, function(err, data) {
	 	if (err) {
	 		return callback(err);
	 	}
	 	callback(null, data);
	});
};

/* 添加新用户 */
exports.addNewUser = function(name, email, pwd, callback) {
	var userEntity = new user.UserModel({
		username: name,
		password: pwd,
		email: email
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
	user.UserModel.find({isonline: 1}, function(err, users) {
		if (err) {
			return callback(err);
		}
		callback(null, users);
	});
};
