var BME280 = require('node-bme280');
var barometer = new BME280({address: 0x77});

module.exports = {};

module.exports.load = function () {
	return new Promise(function (resolve, reject) {
		barometer.begin(function(err) {
			if (err) {
				console.info('error initializing barometer', err);
				reject();
			} else {
				console.info('barometer running');
				resolve();
			}
		});
	});
}

module.exports.getData = function () {
	return new Promise(function (resolve, reject) {
		barometer.readPressureAndTemparature(function(err, pressure, temperature, humidity) {
			if (err) {
				reject(err);
			}
			var latestTemp = temperature.toFixed(2); // TODO: make this use config file for decimal places?
			var latestPressure = (pressure / 100).toFixed(2);
			var latestHumidity = humidity.toFixed(2);
			resolve({
				0: latestTemp,
				1: latestHumidity,
				2: latestPressure
			});
		});
	});
};