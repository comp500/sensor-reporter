const BME280 = require("bme280-sensor");
const bme280 = new BME280(options);

module.exports = {};

module.exports.load = function() {
	return bme280.init();
};

module.exports.getData = function() {
	return new Promise(function(resolve, reject) {
		bme280
			.readSensorData()
			.then(data => {
				var latestTemp = data.temperature_C.toFixed(2); // TODO: make this use config file for decimal places?
				var latestPressure = (data.pressure_hPa / 100).toFixed(2);
				var latestHumidity = data.humidity.toFixed(2);
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
