var express = require('express');
var app = express();
var socket = require('socket.io')();
var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/chat');

// // Models definition
// var NFZ = require('./models/NFZModel');
// var NFZ = require('./models/WAZModel');
// var NFZ = require('./models/DroneModel');

app.get('/*',function(req,res,next){
	res.header('Access-Control-Allow-Credentials' , 'false' );
    res.header('Access-Control-Allow-Origin' , 'http://localhost:80' );
    next(); // http://expressjs.com/guide.html#passing-route control
});

app.post('/*',function(req,res,next){
	res.header('Access-Control-Allow-Credentials' , 'false' );
    res.header('Access-Control-Allow-Origin' , 'http://localhost:80' );
    next(); // http://expressjs.com/guide.html#passing-route control
});

// Socket logic
socket.on('connection', function(sk) {

	clients[sk.client.id] = {
		socket: socket,
		username: '',
		userType: ''
	};
	sk.on('userConnected', function(data) {
		sk.emit('confirmedConnection');
	});
});

module.exports = app;
