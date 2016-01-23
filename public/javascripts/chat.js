$(document).ready(function() {
	var socket = io.connect('http://localhost:3000');
	var from = $('#from').val();
	var to = 'all';
	var to_index = '';

	socket.emit('online', {user: from});
	socket.on('online', function(data) {
		if (data.user != from) {
			var sys = '<div style=\"color:#f00\">系统（'+ now() +'）：用户&nbsp;'+ data.user +'&nbsp;上线了！</div>';
		}
		else {
			var sys = '<div style=\"color:#f00\">系统（'+ now() +'）：欢迎您进入聊天室！</div>'
		}
		$('#contents').append(sys + '<br/>');
		console.log('users:>> ', data.users);
		flushUserList(data.users);
		flushSayTo();

	});

	/* 刷新用户列表 */
	function flushUserList(users) {
		var userList = '<li title=\"双击聊天\" alt=\"all\" class=\"sayingto\" onselectstart=\"return false\">所有成员</li>';
		
		for(var i in users) {
			userList += '<li title=\"双击聊天\" data-index=\"'+ users[i]._id +'\" alt=\"'+ users[i].username +'\" class=\"sayingto\" onselectstart=\"return false\">'+ users[i].username +'</li>';
		}
		$('#list').append(userList);
		/* 添加双击事件 */
		$('#list > li').dblclick(function() {
			if ($(this).attr(alt) != from) {
				to_index = $(this).attr('data-index');
				to = $(this).attr('alt');
				$('#list > li').removeClass('sayingto');
				$(this).addClass('sayingto');
				flushSayTo();
			}
		});
	}

	/* 刷新对话者昵称 */
	function flushSayTo() {
	// $("#from").html(from);
	$("#to").html(to == "all" ? "所有人" : to);
	}

  	/* 获取当前时间 */
	function now() {
	var date = new Date();
	var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
	return time;
	}

});