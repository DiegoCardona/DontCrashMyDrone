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
		dron = JSON.parse(data);
		Drone.findOne({
			external_id: data.id
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
					external_id: data.id,
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
		sk.broadcast.to('/#' + clients[data.id]).emit('report', data);
		sk.broadcast.to('admin').emit('report', data);

		//alerts
		NFZ.find({}, function(err, nfzes) {
			if (nfzes == null)
				nfzes = [];

			nfzes.forEach(function(nfz) {
				distance = getDistance(nfz.latitude, nfz.longitude, dron.latitude, dron.longitude);
				console.log(distance);
				if (distance < 200) {
					alert = {
						title: 'Unauthorized flying zone',
						description: 'You are at less of 200 meters of an unauthorized flying zone.',
						distance: distance
					}
					sk.broadcast.to('/#' + clients[data.id]).emit('alert', alert);
				}
			});
		});

		WAZ.find({}, function(err, wazes) {
			if (wazes == null)
				wazes = [];

			wazes.forEach(function(waz) {
				distance = getDistance(waz.latitude, waz.longitude, dron.latitude, dron.longitude);
				if (distance < 200) {
					alert = {
						title: 'Dangerous weather',
						description: 'At less of 200 meters the weather could be dangerous for fly.',
						distance: distance
					}
					sk.broadcast.to('/#' + clients[data.id]).emit('alert', alert);
				}
			});
		});
	});

	sk.on('clientConnection', function(data) {
		console.log('clientConnection event');
		console.log(data);
		clients[data.id] = sk.client.id;

		if (data.role == 'customer')
			sk.join('/#' + data.droneId);
		else if (data.role == 'admin')
			sk.join('admin');

		User.findOne({
			external_id: data.id
		}, function(err, users) {
			if (users != null && users.length > 0) {
				users.Drone = data.droneId;
				users.role = data.role;
				users.email = data.email;
				users.save();
			} else {
				userSave = new User({
					external_id: data.id,
					Drone: data.droneId,
					role: data.role,
					email: data.email
				});
				userSave.save(function(err) {
					console.log(err)
				});
			}
		});

		Drone.findOne({
			external_id: data.droneId
		}, function(err, drones) {
			WAZ.find({}, function(err, wazes) {
				if (wazes == null)
					wazes = [];
				NFZ.find({}, function(err, nfzes) {
					if (nfzes == null)
						nfzes = [];
					Drone.find({
						external_id: {
							$ne: data.droneId
						}
					}, function(err, dronesExt) {
						if (dronesExt == null)
							dronesExt = [];
						mapData = {
							Drone: drones,
							Drones: dronesExt,
							WAZ: wazes,
							NFZ: nfzes
						}
						sk.emit('/#' + clients[data.id]).emit('connection', mapData);
					});
				});
			});
		});
	});

	sk.on('allMap', function(data) {
		console.log('allMap event');
		console.log(data);
		clients[data.id] = sk.client.id;

		Drone.findOne({
			external_id: data.droneId
		}, function(err, drones) {
			WAZ.find({}, function(err, wazes) {
				if (wazes == null)
					wazes = [];
				NFZ.find({}, function(err, nfzes) {
					if (nfzes == null)
						nfzes = [];
					Drone.find({
						external_id: {
							$ne: droneId
						}
					}, function(err, dronesExt) {
						if (dronesExt == null)
							dronesExt = [];
						mapData = {
							Drone: drones,
							Drones: dronesExt,
							WAZ: wazes,
							NFZ: nfzes
						}
						sk.emit('/#' + clients[data.id]).emit('allMap', mapData);
					});
				});
			});
		});
	});

	sk.on('wazMap', function(data) {
		console.log('wazMap event');
		console.log(data);
		clients[data.id] = sk.client.id;

		if (typeof data.waz != 'undefined') {
			waz = new WAZ(data.waz);
			waz.save();
			sk.emit('/#' + clients[data.id]).emit('wazCreated', waz);
		} else {
			WAZ.find({}, function(err, wazes) {
				if (wazes == null)
					wazes = [];
				sk.emit('/#' + clients[data.id]).emit('wazMap', wazes);
			});
		}
	});

	sk.on('nfzMap', function(data) {
		console.log('nfzMap event');
		console.log(data);
		clients[data.id] = sk.client.id;

		if (typeof data.nfz != 'undefined') {
			nfz = new NFZ(data.nfz);
			nfz.save();
			sk.emit('/#' + clients[data.id]).emit('nfzCreated', nfz);
		} else {
			NFZ.find({}, function(err, nfzes) {
				if (nfzes == null)
					nfzes = [];
				sk.emit('/#' + clients[data.id]).emit('nfzMap', nfzes);
			});
		}
	});

	sk.on('dronesMap', function(data) {
		console.log('dronesMap event');
		console.log(data);
		clients[data.id] = sk.client.id;

		Drone.find({
				external_id: {
					$ne: droneId
				}
			},
			function(err, drones) {
				if (drones == null)
					drones = [];
				sk.emit('/#' + clients[data.id]).emit('dronesMap', drones);
			});
	});

	sk.on('droneHealthy', function(data) {
		console.log('droneHealthy event');
		console.log(data);
		clients[data.id] = sk.client.id;

		Drone.findOne({
			external_id: data.droneId
		}, function(err, drones) {
			sk.emit('/#' + clients[data.id]).emit('droneHealthy', drones);
		});
	});
});

/*the distance returned will be in meters*/
function getDistance(lat1, lon1, lat2, lon2) {

	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1); // deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	var d = R * c; // Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI / 180)
}

module.exports = socket;
