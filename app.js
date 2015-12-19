/**
 * Created by jiangink on 15/12/19.
 */
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/static'));

app.use(function (req, res) {
    res.sendfile('./static/index.html');
});

var io = require('socket.io').listen(app.listen(port));

var messages = [];

io.sockets.on('connection', function (socket) {

    socket.on('getAllMessages', function() {
        socket.emit('allMessages', messages);
    });

    socket.on('createMessage', function (message) {
        console.log('message>>:', message);
        messages.push(message);
        io.sockets.emit('messageAdded', message);
    });
});

console.log('node_chat is on port '+ port +'!');
