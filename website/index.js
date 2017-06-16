// load modules
const express = require('express');
const exphbs  = require('express-handlebars');
const config = require('../config.js');
const app = express();
const compression = require('compression'); // middle-out compression
const minify = require('express-minify');
const db = require('../databases/gcpDatastore.js'); // TODO: move to a config file

// define variables
var latestSensors;
var ready = false;
var databaseReady = false;
var commitHash = null;

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

// start handlebars
app.engine('handlebars', exphbs({defaultLayout: false}));
app.set('view engine', 'handlebars');
app.use(compression()); // use compression
app.use('/src/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // serve bootstrap
app.use('/src/js', express.static(__dirname + '/node_modules/chart.js/dist')); // serve chart.js
app.use(minify()); // use minification
app.use(express.static('static')); // use static folder

app.get('/', function (req, res) { // homepage
	if (ready) {
		var now = new Date(); // get current time
		var secondsPast = (now.getTime() - latestSensors.time.getTime()) / 1000; // get seconds from recorded time
		res.render("index", { // display ready page with sensor data
			ready: true,
			measurementTime: secondsPast.toFixed(0),
			sensors: mergeConfig(latestSensors, "htmlDecimal"),
			commitHash: commitHash
		});
	} else {
		res.render("index", { // show not ready page
			ready: false
		});
	}
});

app.get('/output.csv', function (req, res) { // for export csv file
	if (databaseReady) {
		db.getExportAll().then(function (docs) {
			var titles = "Time";
			Object.keys(config).forEach(function (key) {
				titles += "," + config[key].measurement;
			});
			res.write(titles + "\n"); // titles
			for (let i = 0; i < docs.length; i++) { // for every document
				var time = docs[i].time; // time when recorded
				var formattedDate = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate(); // format time/date for excel format
				var formattedTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
				var formattedDateTime = formattedDate + " " + formattedTime; // github doesn't like long lines
				res.write(formattedDateTime + ","); // write time/date
				// write sensor data
				var sensorData = mergeConfig(docs[i], "exportDecimal");
				for (let i = 0; i < sensorData.length; i++) {
					if (i == (sensorData.length - 1)) {
						res.write(sensorData[i] + "\n");
					} else {
						res.write(sensorData[i] + ",");
					}
				}
			}
			res.end(); // end response
		}); // TODO catch with appropriate logging api?
	}
});

app.get('/data.json', function (req, res) {
	if (databaseReady) {
		var graphLength = 200;
		db.getGraphs(graphLength).then(function (docs) {
			var dataObject = { // output object
				metadata: [],
				values: {}
			};
			var average = {}; // running mean object
			Object.keys(config).forEach(function (key) { // build metadata
				dataObject.metadata.push({ // data for graphs
					unit: config[key].unit,
					measurement: config[key].measurement,
					min: config[key].graphMin,
					max: config[key].graphMax,
					sensorID: key
				});
				dataObject.values[key] = []; // initialise array
				average[key] = 0; // set average to 0
			});
			for (var i = 0; i < docs.length; i++) {
				Object.keys(docs[i]).forEach(function (key) { // add to mean
					if (isNaN(parseInt(key, 10))) {
						// ignore
					} else if (config[key] == null) {
						console.error("Data value "+ key +" not found in configuration");
					} else {
						average[key] += parseFloat(docs[i][key]);
					}
				});
				if ((i % 5) == 4) { // every 5 minutes
					Object.keys(average).forEach(function (key) { // calculate means
						var averageCalculated = average[key] / 5;
						dataObject.values[key].push(averageCalculated.toFixed(config[key].graphDecimal)); // add to values
						average[key] = 0; // reset average
					});
				}
			}
			if (docs.length < graphLength) {
				Object.keys(dataObject.values).forEach(function (key) {
					while (dataObject.values[key].length < (graphLength / 5)) {
						dataObject.values[key].unshift(null);
					}
				});
			}
			res.send(JSON.stringify(dataObject)); // send data
		});
	}
});

app.listen(80, function () { // listen on port 80
	console.log('Weather station online on port 80');
});
