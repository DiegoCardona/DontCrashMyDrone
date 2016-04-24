var mongoose = require('mongoose');
var NFZ = require('../models/NFZModel.js');
//var integrations = require('./news');
var mv = require('mv');
var fs = require('fs');

fs.readdir(__dirname + '/news/', function(err, data) {

	if (data.length > 0) {
		data.forEach(function(mod) {
			console.log(mod);
			var integration = require('./news/' + mod);
			if (typeof integration.run != 'undefined') {
				elements = integration.run();
				saveElements(elements);
			} else {
				console.log('the integrtion number ' + (index + 1) + ' doesn\'t have the function run');
			}

		});
	}
});

function saveElements(nfzElements) {
	var processed = 0;
	if (nfzElements.length > 0 && nfzElements != null && typeof nfzElements != 'undefined') {
		nfzElements.forEach(function(nfz, index) {
			model = new NFZ(nfz);
			console.log(model);
			model.save(function(err) {
				console.log(err);
				processed++;
				if (processed == nfzElements.length) {
					mv('news/' + nfz.name + '.js', 'processed/' + nfz.name + '.js', function(err) {
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
