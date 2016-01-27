var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: {type: 'String', required: true},
	password: {type: 'String', required: true},
	intro: {type: 'String', default: 'personal details'},
	email: {type: 'String', default: 'example@nodechat.com'},
	isonline: {type: 'Number', default: 0},
	sex: {type: 'Number', default: 0}
});

exports.UserModel = mongoose.model('User', UserSchema);
