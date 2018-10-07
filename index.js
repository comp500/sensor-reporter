// load modules
const sensors = require("./sensors/index.js");
const config = require("./config.js");
const db = require("./pushDestinations/gcpDatastore.js");
const pubnub = require("./pushDestinations/pubnub.js");
const schedule = require("node-schedule");

var currentNumber = 0;
var currentAverages = {};

sensors
	.load()
	.then(pubnub.connect())
	.then(db.connect())
	.then(function() {
		// read first measurement immediately
		setImmediate(readData);
		// read measurements on interval
		setInterval(readData, config.recordInterval);
		// send to GCP on cron interval
		schedule.scheduleJob(config.storeCron, function(fireDate) {
			if (currentNumber > 0) {
				Object.keys(currentAverages).forEach(key => {
					// Calculate averages
					currentAverages[key] = (
						currentAverages[key] / currentNumber
					).toFixed(config.decimalPlaces[key]);
				});
				currentAverages.time = fireDate;
				db.pushData(currentAverages); // Push averages to cloud datastore

				// Clear averages
				currentAverages = {};
				currentNumber = 0;
			}
		});
	})
	.catch(function(err) {
		console.error(err);
		return;
	});

function addAverages(values) {
	Object.keys(values).forEach(key => {
		if (key == "time") return;
		if (currentAverages[key]) {
			currentAverages[key] += parseFloat(values[key]);
		} else {
			currentAverages[key] = parseFloat(values[key]);
		}
	});
	currentNumber++;
}

function readData() {
	// read data from sensors
	sensors
		.run()
		.then(function(values) {
			values.time = new Date();
			pubnub.pushData(values);
			addAverages(values);
		})
		.catch(function(err) {
			console.error(err);
			return;
		});
}
