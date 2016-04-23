/*model thtat define de drone model, the height wold be in meters, the velocity wold be in meters over seconds*/
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	latitude: {
		type: Number,
		default: 0.0
	}
	longitude: {
		type: Number,
		default: 0.0
	},
	height: {
		type: Number,
		default: 0.0
	},
	destination: {
		type: String,
		default: 'ND'
	},
	velocity: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('Drone', schema);
