/*model thtat define de Non Fly Zones*/
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	latitude: {
		type: Number,
		default: 0.0
	},
	longitude: {
		type: Number,
		default: 0.0
	},
	radius: {
		type: Number,
		default: 1
	},
	description: {
		type: String,
		default: 'No description Assgined'
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('NFZ', schema);
