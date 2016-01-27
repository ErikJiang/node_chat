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
		var sys = '';
		if (data.user != from) {
			sys = '<div class=\"alert alert-success\" role=\"alert\">系统（'+ now() +'）：用户&nbsp;'+ data.user +'&nbsp;上线了！</div><br/>';
		}
		else {
			sys = '<div class=\"alert alert-success\" role=\"alert\">系统（'+ now() +'）：欢迎您进入聊天室！</div><br/>'
		}
		appendContent(sys);
		flushUserList(data.users);
		flushSayTo();
	});

	//离线通知 
	socket.on('offline', function (data) {
		var sys = '<div class=\"alert alert-success\" role=\"alert\">系统（' + now() + '）：用户&nbsp;' + data.user + '&nbsp;下线了！</div><br/>';
		appendContent(sys);
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
		var sys = '<div class=\"alert alert-danger\" role=\"alert\">系统：连接服务器失败！</div><br/>';
		appendContent(sys);
		$('#list').empty();
	});

	// 服务器重启
	socket.on('reconnect', function() {
		var sys = '<div class=\"alert alert-danger\" role=\"alert\">系统：重新连接服务器！</div><br/>';
		appendContent(sys);
		socket.emit('online', {user: from});
	});

	// 消息处理
	socket.on('message', function(data) {
		console.log('message data socket on:', data);
		var msg = '';
		if (data.to == 'all') {
			msg = '<div class=\"alert alert-info\" role=\"alert\">' + data.from + '&nbsp;(' + now() + ')&nbsp;对 所有人 说：<br/>' + data.msg + '</div><br />';
		}
		if (data.to == from) {
			msg = '<div class=\"alert alert-info\" role=\"alert\" >' + data.from + '&nbsp;(' + now() + ')&nbsp;对 你 说：<br/>' + data.msg + '</div><br />';
		}
		appendContent(msg);
	});

	/* 刷新用户列表 */
	function flushUserList(users) {
		$('#list').html('');
		var userList = '<li title=\"双击聊天\" alt=\"all\" class=\"list-group-item list-group-item-success\" onselectstart=\"return false\"><i class=\"fa fa-child\"></i>&nbsp;<span>所有成员</span></li>';
		
		for(var i in users) {
			userList += '<li title=\"双击聊天\" data-index=\"'+ users[i]._id +'\" alt=\"'+ users[i].username +'\" class=\"list-group-item\" onselectstart=\"return false\"><i class=\"fa fa-child\"></i>&nbsp;<span>'+ users[i].username +'</span></li>';
		}
		$('#list').append(userList);
		/* 添加双击事件 */
		$('#list > li').dblclick(function() {
			if ($(this).attr('alt') != from) {
				to_index = $(this).attr('data-index');
				to = $(this).attr('alt');
				$('#list > li').removeClass('list-group-item-success');
				$(this).addClass('list-group-item-success');
				flushSayTo();
			}
		});
	}

	/* 加载刷新最新信息 */
	function appendContent(message) {
		$("#contents").append(message);
		// 将滑动条移至最下方显示最新信息
		$("#contents").scrollTop($("#contents")[0].scrollHeight);
	}

	/* 刷新对话者昵称 */
	function flushSayTo() {
		$('#to').attr('data-index', to_index);
		$("#to").html(to == "all" ? "所有成员" : to);
	}

  	/* 获取当前时间 */
	function now() {
		var date = new Date();
		var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds());
		return time;
	}

	/* 发送聊天信息 */
	$('#send').click(function() {
		var $msg = $('#input_content').val();
		var text = '';
		if($msg != "") {
			if (to == 'all') {
				text = '<div class=\"alert alert-info\" role=\"alert\">你&nbsp;(' + now() + ')&nbsp;对 所有人 说：<br/>' + $msg + '</div><br />';
			}
			else {
				text = '<div class=\"alert alert-info\" role=\"alert\" >你&nbsp;(' + now() + ')&nbsp;对 ' + to + ' 说：<br/>' + $msg + '</div><br />';
			}
			appendContent(text);
			socket.emit('message', {
				from: from, 
				to: to,
				msg: $msg
			});
			$('#input_content').val('').focus();
		}
	});
});
