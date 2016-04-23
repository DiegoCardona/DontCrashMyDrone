/*model thtat define de Non Fly Zones*/
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
	radio: {
		type: Number,
		default: 1
	},
	description: {
		type: String,
		default: 'No description Assgined'
	}
});

module.exports = mongoose.model('NFZ', schema);
