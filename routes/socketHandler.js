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
			//更新用户上线状态
			userApi.updateStatus(socket.name, 1, function(err, user) {
				if(err) {
					console.log('socket update user status fail. ', err);
					return res.send('update user status fail.');
				}
				//获取用户列表
				userApi.getUserList(function(err, users) {
					if (err) {
						console.log('/ get user list fail. ', err);
						return;
					}
					//向所有用户广播该用户上线信息
					socket.name = data.user;
	    			io.sockets.emit('online', {users: users, user: data.user});
				});
			});
		});

		/* 消息处理 */
		socket.on('message', function(data) {
			socket.broadcast.emit('message', data);
		});

		/* 客户端关闭连接 */
		socket.on('disconnect', function() {
			//更新用户下线状态
			userApi.updateStatus(socket.name, 0, function(err, user) {
				if(err) {
					console.log('socket update user status fail. ', err);
					return res.send('update user status fail.');
				}
				//获取用户列表
				userApi.getUserList(function(err, users) {
					if (err) {
						console.log('/ get user list fail. ', err);
						return;
					}
					//向所有用户广播该用户下线信息
	    			socket.broadcast.emit('offline', {users: users, user: socket.name});
				});
				
			});
		});

	});
}


