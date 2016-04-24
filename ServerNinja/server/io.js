// Environment resources
var app = require('./app');
var socket = require('socket.io')();
var moment = require('moment');
var mongoose = require('mongoose');

// Initialize vars
var clients = {}; // = [];
var operatorsSockets = [];
var appOperators = [];

var log = function(inst) {
	console.dir(inst.get());
}

//mongoose.connect('mongodb://localhost:27017/chat');

// Models definition
var NFZ = require('./models/NFZModel');
var WAZ = require('./models/WAZModel');
var Drone = require('./models/DroneModel');

// Socket logic
socket.on('connection', function(sk) {

	clients[sk.client.id] = {
		socket: socket,
		username: '',
		userType: ''
	};

	sk.on('testConnection', function(data) {
		sk.emit('confirmedConnection');
	});

	sk.on('droneReport', function(data) {
		sk.emit('ok');
	});

	sk.on('clientConnection', function(data) {
		mapData = {
			Drone: {
				id: '01',
				accuracy: 0,
				latitude: 0.0,
				longitude: 0.0,
				height: 0.0,
				destination: 'ND',
				velocity: 0
			},
			WAZ: [{
				latitude: 0.0,
				longitude: 0.0,
				radio: 1,
				description: 'No description Assgined',
				warinig_levet: 'low'
			}],
			NFZ: [{
				latitude: 0.0,
				longitude: 0.0,
				radio: 1,
				description: 'No description Assgined'
			}]
		};
		sk.emit(mapData);
	});

	sk.on('allMap', function(data) {
		mapData = {
			Drone: {
				id: '01',
				accuracy: 0,
				latitude: 0.0,
				longitude: 0.0,
				height: 0.0,
				destination: 'ND',
				velocity: 0
			},
			WAZ: [{
				latitude: 0.0,
				longitude: 0.0,
				radio: 1,
				description: 'No description Assgined',
				warinig_levet: 'low'
			}],
			NFZ: [{
				latitude: 0.0,
				longitude: 0.0,
				radio: 1,
				description: 'No description Assgined'
			}]
		};
		sk.emit(mapData);
	});

	sk.on('wazMap', function(data) {
		wazMap = [{
			latitude: 0.0,
			longitude: 0.0,
			radio: 1,
			description: 'No description Assgined',
			warinig_levet: 'low'
		}];
		sk.emit(wazMap);
	});

	sk.on('nfzMap', function(data) {
		nfzMap = [{
			latitude: 0.0,
			longitude: 0.0,
			radio: 1,
			description: 'No description Assgined'
		}];
		sk.emit(nfzMap);
	});

	sk.on('dronesMap', function(data) {
		droneMap = [{
			id: '01',
			accuracy: 0,
			latitude: 0.0,
			longitude: 0.0,
			height: 0.0,
			destination: 'ND',
			velocity: 0
		}];
		sk.emit(droneMap);
	});

	sk.on('droneHealthy', function(data) {
		droneMap = {
			id: '01',
			accuracy: 0,
			latitude: 0.0,
			longitude: 0.0,
			height: 0.0,
			destination: 'ND',
			velocity: 0
		};
		sk.emit(droneMap);
	});
});

module.exports = socket;
