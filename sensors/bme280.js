const BME280 = require("bme280-sensor");
const bme280 = new BME280(); // Use defaults
const config = require("../config.js");

module.exports = {};

module.exports.load = function() {
	return bme280.init();
};

module.exports.getData = function() {
	return new Promise(function(resolve, reject) {
		bme280
			.readSensorData()
			.then(data => {
				var latestTemp = data.temperature_C.toFixed(config.decimalPlaces[0]);
				var latestHumidity = data.humidity.toFixed(config.decimalPlaces[1]);
				var latestPressure = data.pressure_hPa.toFixed(config.decimalPlaces[2]);
				resolve({
					0: latestTemp,
					1: latestHumidity,
					2: latestPressure
				});
			})
			.catch(err => {
				reject(err);
			});
	});
};
