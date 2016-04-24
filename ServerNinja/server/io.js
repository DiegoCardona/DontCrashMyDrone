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
		sk.join(data.id);
		sk.to(data.id).emit('confirmedConnection', 'ok');
	});

	sk.on('droneReport', function(data) {
		sk.join(data.id);
		Drone.findOne({
			id: data.id
		}, function(err, drones) {
			if (drones != null && drones.length > 0) {
				drones.accuracy = data.accuracy;
				drones.latitude = data.latitude;
				drones.longitude = data.longitude;
				drones.height = data.height;
				drones.orientation = data.orientation;
				drones.velocity = data.velocity;
				drones.save();
			} else {
				droneSave = new Drone({
					id: data.id,
					accuracy: data.accuracy,
					latitude: data.latitude,
					longitude: data.longitude,
					height: data.height,
					orientation: data.orientation,
					velocity: data.velocity
				});
				droneSave.save(function(err) {
					console.log(err)
				});
			}
		});
		sk.to(data.id).emit('report', data);
		sk.to('admin').emit('report', data);
	});

	sk.on('clientConnection', function(data) {
		if (typeof data.droneId != 'undefined')
			sk.join(data.droneId);
		else if (typeof data.role != 'admin')
			sk.join('admin');
		mapData = {
			Drone: {
				id: '01',
				accuracy: 0,
				latitude: 0.0,
				longitude: 0.0,
				height: 0.0,
				orientation: 'ND',
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
		sk.to(data.id).emit('connection', mapData);
	});

	sk.on('allMap', function(data) {
		sk.join(data.id);
		mapData = {
			Drone: {
				id: '01',
				accuracy: 0,
				latitude: 0.0,
				longitude: 0.0,
				height: 0.0,
				orientation: 'ND',
				velocity: 0
			},
			Drones: [{
				id: '02',
				accuracy: 0,
				latitude: 0.0,
				longitude: 0.0,
				height: 0.0,
				orientation: 'ND',
				velocity: 0
			}],
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
		sk.to(data.id).emit('allMap', mapData);
	});

	sk.on('wazMap', function(data) {
		sk.join(data.id);
		wazMap = [{
			latitude: 0.0,
			longitude: 0.0,
			radio: 1,
			description: 'No description Assgined',
			warinig_levet: 'low'
		}];
		sk.to(data.id).emit('wazMap', wazMap);
	});

	sk.on('nfzMap', function(data) {
		sk.join(data.id);
		nfzMap = [{
			latitude: 0.0,
			longitude: 0.0,
			radio: 1,
			description: 'No description Assgined'
		}];
		sk.to(data.id).emit('nfzMap', nfzMap);
	});

	sk.on('dronesMap', function(data) {
		sk.join(data.id);
		droneMap = [{
			id: '01',
			accuracy: 0,
			latitude: 0.0,
			longitude: 0.0,
			height: 0.0,
			orientation: 'ND',
			velocity: 0
		}];
		sk.to(data.id).emit('dronesMap', droneMap);
	});

	sk.on('droneHealthy', function(data) {
		sk.join(data.id);
		droneMap = {
			id: '01',
			accuracy: 0,
			latitude: 0.0,
			longitude: 0.0,
			height: 0.0,
			orientation: 'ND',
			velocity: 0
		};
		sk.to(data.id).emit('droneHealthy', droneMap);
	});
});

module.exports = socket;
