/*model thtat define de drone model, the height wold be in meters, the velocity wold be in meters over seconds*/
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	external_id: {
		type: String,
		default: '0'
	},
	accuracy: {
		type: Number,
		default: 0.0
	},
	latitude: {
		type: Number,
		default: 0.0
	},
	longitude: {
		type: Number,
		default: 0.0
	},
	height: {
		type: Number,
		default: 0.0
	},
	orientation: {
		type: String,
		default: 'ND'
	},
	velocity: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('Drone', schema);
