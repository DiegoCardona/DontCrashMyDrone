/*model thtat define de drone model, the height wold be in meters, the velocity wold be in meters over seconds*/
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	external_id: {
		type: String,
		default: '0'
	},
	name: {
		type: String,
		default: 'NoName'
	},
	email: {
		type: String,
		default: ''
	},
	password: {
		type: String,
		default: ''
	},
	lastConnection: {
		type: Date,
		default: Date.now
	},
	Drone: {
		type: String,
		default: ''
	}
});

module.exports = mongoose.model('User', schema);
