var BME280 = require('node-bme280');
var barometer = new BME280({address: 0x77});

module.exports = function () {
	return new Promise(function (resolve, reject) {
		barometer.readPressureAndTemparature(function(err, pressure, temperature, humidity) {
			latestTime = new Date();
			latestTemp = temperature.toFixed(2);
			latestPressure = (pressure / 100).toFixed(2);
			latestHumidity = humidity.toFixed(2);
			resolve([
				{
					sensorUUID: "1cf70b5a-e162-43e6-bf6d-6367373bbe30",
					value: parseFloat(latestTemp).toFixed(1),
					unit: "&#176;C",
					measurement: "Temperature",
					location: "ICT office",
					htmlDecimal: 1
				},
				{
					sensorUUID: "b19d22f6-abf9-4ab6-9544-845d041fde9e",
					value: parseFloat(latestHumidity).toFixed(1),
					unit: "%",
					measurement: "Humidity",
					location: "ICT office",
					htmlDecimal: 1
				},
				{
					sensorUUID: "819a2fcd-2ba4-462e-ac1d-d68ac4fe66fb",
					value: parseFloat(latestPressure).toFixed(0),
					unit: "hPa",
					small: true,
					measurement: "Pressure",
					location: "ICT office",
					htmlDecimal: 0
				}
			]);
		});
	});
}
