$(document).ready(function() {
	var socket = io.connect('http://localhost:3000');
	var from = $('#from').html();
	var to = 'all';
	var to_index = 'all';

	// F5 刷新提示
	$(window).keydown(function (e) {
		if (e.keyCode == 116) {
			if (!confirm("刷新将会清除所有聊天记录，确定要刷新么？")) {
				e.preventDefault();
			}
		}
	});
	
	//上线通知 
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

	//离线通知 
	socket.on('offline', function (data) {
		var sys = '<div style="color:#f00">系统(' + now() + '):' + '用户 ' + data.user + ' 下线了！</div>';
		$("#contents").append(sys + "<br/>");
		//刷新用户在线列表
		flushUserList(data.users);
		//聊天对象正好是下线用户，则默认回复到群聊状态
		if (data.user == to) {
			to = "all";
		}
		//显示正在对谁说话
		flushSayTo();
	});

	// 服务器关闭
	socket.on('disconnect', function() {
		var sys = '<div style=\"color:#f00\">系统：连接服务器失败！</div>';
		$('contents').append(sys + "<br/>");
		$('#list').empty();
	});

	// 服务器重启
	socket.on('reconnect', function() {
		var sys = '<div style=\"color:#f00\">系统：重新连接服务器！</div>';
		$('contents').append(sys + "<br/>");
		socket.emit('online', {user: from});
	});

	// 消息处理
	socket.on('message', function(data) {
		console.log('message data socket on:', data);
		if (data.to == 'all') {
			$("#contents").append('<div>' + data.from + '(' + now() + ')对 所有人 说：<br/>' + data.msg + '</div><br />');
		}
		if (data.to == from) {
			$("#contents").append('<div style="color:#00f" >' + data.from + '(' + now() + ')对 你 说：<br/>' + data.msg + '</div><br />');
		}
	});

	/* 刷新用户列表 */
	function flushUserList(users) {
		$('#list').html('');
		var userList = '<li title=\"双击聊天\" alt=\"all\" class=\"sayingto\" onselectstart=\"return false\">所有成员</li>';
		
		for(var i in users) {
			userList += '<li title=\"双击聊天\" data-index=\"'+ users[i]._id +'\" alt=\"'+ users[i].username +'\" onselectstart=\"return false\">'+ users[i].username +'</li>';
		}
		$('#list').append(userList);
		/* 添加双击事件 */
		$('#list > li').dblclick(function() {
			if ($(this).attr('alt') != from) {
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
		$('#to').attr('data-index', to_index);
		$("#to").html(to == "all" ? "所有人" : to);
	}

  	/* 获取当前时间 */
	function now() {
		var date = new Date();
		var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
		return time;
	}

	/* 发送聊天信息 */
	$('#send').click(function() {
		var $msg = $('#input_content').html();
		console.log('msg>>: ', $msg);
		if($msg != "") {
			if (to == 'all') {
				$('#contents').append('<div>你(' + now() + ')对 所有人 说：<br/>' + $msg + '</div><br />');
			}
			else {
				$('#contents').append('<div style="color:#00f" >你(' + now() + ')对 ' + to + ' 说：<br/>' + $msg + '</div><br />');
			}
			socket.emit('message', {
				from: from, 
				to: to,
				msg: $msg
			});
			$('#input_content').html('').focus();
		}
	});

});