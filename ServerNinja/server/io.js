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
var User = require('./models/UserModel');

// Socket logic
socket.on('connection', function(sk) {



	sk.on('testConnection', function(data) {
		console.log('testConnection event');
		console.log(data);
		clients[data.id] = sk.client.id;
		sk.emit('/#' + clients[data.id]).emit('confirmedConnection', 'ok');
	});

	sk.on('droneReport', function(data) {
		console.log('droneReport event');
		console.log(data);
		clients[data.id] = sk.client.id;

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
		sk.emit('/#' + clients[data.id]).emit('report', data);
		sk.broadcast.to('admin').emit('report', data);
	});

	sk.on('clientConnection', function(data) {
		console.log('clientConnection event');
		console.log(data);
		clients[data.id] = sk.client.id;

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
		sk.emit('/#' + clients[data.id]).emit('connection', mapData);
	});

	sk.on('allMap', function(data) {
		console.log('allMap event');
		console.log(data);
		clients[data.id] = sk.client.id;

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
		sk.emit('/#' + clients[data.id]).emit('allMap', mapData);
	});

	sk.on('wazMap', function(data) {
		console.log('wazMap event');
		console.log(data);
		clients[data.id] = sk.client.id;

		wazMap = [{
			latitude: 0.0,
			longitude: 0.0,
			radio: 1,
			description: 'No description Assgined',
			warinig_levet: 'low'
		}];
		sk.emit('/#' + clients[data.id]).emit('wazMap', wazMap);
	});

	sk.on('nfzMap', function(data) {
		console.log('nfzMap event');
		console.log(data);
		clients[data.id] = sk.client.id;

		nfzMap = [{
			latitude: 0.0,
			longitude: 0.0,
			radio: 1,
			description: 'No description Assgined'
		}];
		sk.emit('/#' + clients[data.id]).emit('nfzMap', nfzMap);
	});

	sk.on('dronesMap', function(data) {
		console.log('dronesMap event');
		console.log(data);
		clients[data.id] = sk.client.id;

		droneMap = [{
			id: '01',
			accuracy: 0,
			latitude: 0.0,
			longitude: 0.0,
			height: 0.0,
			orientation: 'ND',
			velocity: 0
		}];
		sk.emit('/#' + clients[data.id]).emit('dronesMap', droneMap);
	});

	sk.on('droneHealthy', function(data) {
		console.log('droneHealthy event');
		console.log(data);
		clients[data.id] = sk.client.id;

		droneMap = {
			id: '01',
			accuracy: 0,
			latitude: 0.0,
			longitude: 0.0,
			height: 0.0,
			orientation: 'ND',
			velocity: 0
		};
		sk.emit('/#' + clients[data.id]).emit('droneHealthy', droneMap);
	});
});

module.exports = socket;
