var test = {
	name: 'testIntegracion',
	run: function() {
		return [{
			latitude: 0.1,
			longitude: 1.0,
			radius: 20,
			description: 'No description Assgined',
			created: new Date(),
			updated: new Date()
		}, {
			latitude: 2.0,
			longitude: 0.3,
			radius: 16,
			description: 'No description Assgined',
			created: new Date(),
			updated: new Date()
		}];
	}
};

module.exports = test;
