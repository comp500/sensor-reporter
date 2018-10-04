// load modules
const sensors = require('./sensors/index.js');
const config = require('./config.js');
const sensorConfig = require('./sensors/config.js');
const live = require('./live.js');
const db = require('./databases/gcpDatastore.js'); // TODO: move to a config file

sensors.load().then(function () {
	db.connect().then(function () {
		// read first measurement immediately
		setImmediate(readData);
		// read measurements on interval
		setInterval(readData, config.interval);
	});
}).catch(function (err) {
	console.error(err);
	return;
});

var readData = function () {
	// read data from sensors
	sensors.run().then(function (values) {
		values.time = new Date();
		live.setLatest(values);
		db.pushData(values);
	}).catch(function (err) {
		console.error(err);
		return;
	});
};