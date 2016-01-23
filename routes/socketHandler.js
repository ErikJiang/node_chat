var http = require('http');
var userApi = require('../models/users.server.api');

module.exports = {
	createServer : function(app){
		var server = http.Server(app);
		var io = require('socket.io')(server);
		messageHandler(io);
		return server;
	},
};

function messageHandler(io) {
	io.on('connection', function(socket) {
		console.log(socket.id, ' just connected.');
		
		/* 用户上线通知 */
		socket.on('online', function(data) {
			console.log('server online receive msg', data);
			//获取用户列表
			userApi.getUserList(function(err, users) {
				if (err) {
					console.log('/ get user list fail. ', err);
					return;
				}
				//向所有用户广播该用户上线信息
    			io.sockets.emit('online', {users: users, user: data.user});
			});	
		});
	});
}


