// load modules
const sensors = require('./sensors/index.js');
const config = require('./config.js');
const live = require('./live.js');
const db = require('./databases/gcpDatastore.js'); // TODO: move to a config file

sensors.load().then(function () {
	db.connect().then(function () {
		// read first measurement immediately
		setImmediate(readData);
		// read measurements on interval
		setInterval(readData, config.interval);
	});
	require('child_process').exec('git rev-parse HEAD', function(err, stdout) {
		if (err) {
			console.error(err);
		} else {
			live.setCommitHash(stdout);
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
		live.setLatest(values);
		db.pushData(values);
	}).catch(function (err) {
		console.error(err);
		return;
	});
};

if (config.website && config.website.enable) {
	require('./website/index.js')();
}