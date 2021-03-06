/*model thtat define de Weather alert Zones*/
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
	warning_levet: {
		type: String,
		default: 'low'
	}
});

module.exports = mongoose.model('WAZ', schema);
