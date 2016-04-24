var mongoose = require('mongoose');
var NFZ = require('../models/NFZModel.js');
//var integrations = require('./news');
var mv = require('mv');
var fs = require('fs');

mongoose.connect('mongodb://localhost:27017');

fs.readdir(__dirname + '/news/', function(err, data) {

	if (data.length > 0) {
		data.forEach(function(mod) {
			console.log(mod);
			var integration = require('./news/' + mod);
			if (typeof integration.run != 'undefined') {
				elements = integration.run();
				saveElements(elements, mod);
			} else {
				console.log('the integrtion number ' + (index + 1) + ' doesn\'t have the function run');
			}

		});
	}
});

function saveElements(nfzElements, fileName) {
	var processed = 0;
	console.log(nfzElements.length);
	if (nfzElements.length > 0 && nfzElements != null && typeof nfzElements != 'undefined') {
		nfzElements.forEach(function(nfz, index) {
			model = new NFZ(nfz);
			console.log(model);
			model.save(function(err) {
				console.log(err);
				processed++;
				console.log(processed);
				if (processed == nfzElements.length) {
					mv(__dirname + '/news/' + fileName, __dirname + '/processed/' + fileName, function(err) {
						if (err) {
							console.log(err);
						} else {
							console.log('Migration success.');
						}
					});
				}
			});
		});
	}
}
