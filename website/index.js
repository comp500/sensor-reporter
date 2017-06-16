// load modules
const express = require('express');
const exphbs  = require('express-handlebars');
const sensorConfig = require('../sensors/config.js');
const app = express();
const compression = require('compression'); // middle-out compression
const minify = require('express-minify');
const db = require('../databases/gcpDatastore.js'); // TODO: move to a config file

// define variables
var latestSensors;
var ready = false;
var databaseReady = false;
var commitHash = null;

// start handlebars
app.engine('handlebars', exphbs({defaultLayout: false}));
app.set('view engine', 'handlebars');
app.use(compression()); // use compression
app.use('/src/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // serve bootstrap
app.use('/src/js', express.static(__dirname + '/node_modules/chart.js/dist')); // serve chart.js
app.use(minify()); // use minification
app.use(express.static('static')); // use static folder

var mergeConfig = function (data, decimal) {
	var merged = []; // order is implied in export, not needed in live
	Object.keys(config).forEach(function (key) { // to ignore a sensor, remove from config
		if (data[key] != null) {
			var rounded = parseFloat(data[key]).toFixed(config[key][decimal]); // round to config value
			if (decimal == "exportDecimal") {
				merged.push(rounded); // just push value
			} else if (decimal == "htmlDecimal") {
				var dataOutput = { // data for templating engine
					value: rounded,
					unit: config[key].unit,
					measurement: config[key].measurement,
					location: config[key].location,
					sensorID: key
				};
				if (config[key].small == true) { // default is false
					dataOutput.small = true;
				}
				merged.push(dataOutput);
			} else {
				console.error("Invalid rounding value");
			}
		} else {
			console.error("Configured sensor not found in data.");
		}
	});
	return merged;
};

require("routes.js")(app);

app.listen(config.website.port, function () { // listen on port
	console.log('Weather station online on port ' + config.website.port);
});
