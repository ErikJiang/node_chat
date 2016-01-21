/**
 * Created by jiangink on 16/1/20.
 */

$(document).ready(function () {
    var socket = io.connect('http://localhost:3000');

    // 读取 cookie 中的用户名
    var curUser = $.cookie('user');
    // 设置默认接收对象为‘所有人’
    var to = 'all';
    socket.emit('online', {user: curUser});
    socket.on('online', function (data) {
        //显示系统信息
        if (data.user != curUser) {
            var sys = '<div style="color:#f00">系统(' + now() + '):' + '用户' + data.user + ' 上线了！</div>';
        }
        else {
            var sys = '<div style="color:#f00">系统(' + now() + '):你进入了聊天室！</div>';
        }
        $('#contents').append(sys + '<br/>');
        //刷新用户在线列表
        flushUsers(data.users);
        //显示正在对谁聊天
        showSayTo();
    });

    //刷新用户在线列表
    function flushUsers(users) {
        //清空用户列表，并添加‘所有人’选项默认灰色选中
        $('#list').empty().append('<li title="双击聊天" alt="all" class="sayingto" onselectstart="return flase">所有人</li>');
        //遍历生成用户在线列表
        for (var i in users) {
            $('#list').append('<li title="双击聊天" alt="'+ users[i] +'" onselectstart="return flase">'+ users[i] +'</li>');
        }
        //双击对某人聊天
        $('#list > li').dblclick(function () {
            //若双击并非自己的名字
            if($(this).attr('alt') != curUser) {
                to = $(this).attr('alt');   //设置对话者
                $('#list > li').removeClass('sayingto');    //清楚之前的选中样式
                $(this).addClass('sayingto');   //添加双击选中样式
                showSayTo();
            }
        });
    }
    //显示聊天对象
    function showSayTo() {
        $('#from').html(curUser);
        $('#to').html(to == 'all' ? '所有人' : to);
    }

    function now() {
        var date = new Date();
        var time = date.getFullYear() + '-' + (date.getMonth()+1) +
                '-' + date.getDate() + ' ' + date.getHours() + ':' +
                (date.getMinutes()<10 ? ('0'+date.getMinutes()):date.getMinutes()) +
                ":" + (date.getSeconds()<10?('0'+date.getSeconds()): date.getSeconds());
        return time;
    }

});



