// load modules
const sensors = require('./sensors/index.js');
const config = require('./config.js');
const db = require('./pushDestinations/gcpDatastore.js');
const pubnub = require('./pushDestinations/pubnub.js');

sensors.load().then(pubnub.connect()).then(db.connect()).then(function () {
	// read first measurement immediately
	setImmediate(readData);
	// read measurements on interval
	setInterval(readData, config.recordInterval);
}).catch(function (err) {
	console.error(err);
	return;
});

var counter = 0;

var readData = function () {
	// read data from sensors
	sensors.run().then(function (values) {
		values.time = new Date();
		pubnub.pushData(values);
		counter++;
		// TODO averages
		if (counter == config.storeInterval) {
			db.pushData(values);
			counter = 0;
		}
	}).catch(function (err) {
		console.error(err);
		return;
	});
};