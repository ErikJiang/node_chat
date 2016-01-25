var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: {type: 'String', required: true},
	password: {type: 'String', required: true},
	isonline: {type: 'Number', default: 1},
	sex: {type: 'Number', default: 0},
	intro: {type: 'String', default: 'personal details'}
});

exports.UserModel = mongoose.model('User', UserSchema);
