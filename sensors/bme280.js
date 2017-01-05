var BME280 = require('node-bme280');
var barometer = new BME280({address: 0x77});

module.exports = function () {
	return new Promise(function (resolve, reject) {
		barometer.begin(function(err) {
			if (err) {
				console.info('error initializing barometer', err);
				reject();
			} else {
				console.info('barometer running');
				resolve(new Promise(function (resolve, reject) {
					barometer.readPressureAndTemparature(function(err, pressure, temperature, humidity) {
						latestTemp = temperature.toFixed(2);
						latestPressure = (pressure / 100).toFixed(2);
						latestHumidity = humidity.toFixed(2);
						resolve([
							{
								sensorID: 1,
								value: latestTemp,
								unit: "&#176;C",
								measurement: "Temperature",
								location: "ICT office",
								htmlDecimal: 1
							},
							{
								sensorID: 2,
								value: latestHumidity,
								unit: "%",
								measurement: "Humidity",
								location: "ICT office",
								htmlDecimal: 1
							},
							{
								sensorID: 3,
								value: latestPressure,
								unit: "hPa",
								small: true,
								measurement: "Pressure",
								location: "ICT office",
								htmlDecimal: 0
							}
						]);
						resolve();
					});
				}));
			}
		});
	});
}
