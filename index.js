// load modules
const sensors = require('./sensors/index.js');
const config = require('./config.js');
const db = require('./databases/gcpDatastore.js'); // TODO: move to a config file

// define variables
var latestSensors;
var ready = false;
var databaseReady = false;
var commitHash = null;

sensors.load().then(function () {
	db.connect().then(function () {
		databaseReady = true;
		// read first measurement immediately
		setImmediate(readData);
		// read measurements on interval
		setInterval(readData, config.interval);
	});
	require('child_process').exec('git rev-parse HEAD', function(err, stdout) {
		if (err) {
			console.error(err);
		} else {
			commitHash = stdout;
		}
	});
}).catch(function (err) {
	console.error(err);
	return;
});

var readData = function () {
	// read data from sensors
	sensors.run().then(function (values) {
		values.time = new Date();
		latestSensors = values;
		db.pushData(values);
		ready = true;
	}).catch(function (err) {
		console.error(err);
		return;
	});
};

if (config.website && config.website.enable) {
	require('./website/index.js')();
}