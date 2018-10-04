// load modules
const sensors = require('./sensors/index.js');
const config = require('./config.js');
const db = require('./pushDestinations/gcpDatastore.js');

sensors.load().then(function () {
	db.connect().then(function () {
		// read first measurement immediately
		setImmediate(readData);
		// read measurements on interval
		setInterval(readData, config.recordInterval);
	});
}).catch(function (err) {
	console.error(err);
	return;
});

var readData = function () {
	// read data from sensors
	sensors.run().then(function (values) {
		values.time = new Date();
		db.pushData(values);
	}).catch(function (err) {
		console.error(err);
		return;
	});
};