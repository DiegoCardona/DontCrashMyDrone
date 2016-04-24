/*model thtat define de drone model, the height wold be in meters, the velocity wold be in meters over seconds*/
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	id: {
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
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Drone'
	}
});

module.exports = mongoose.model('User', schema);
