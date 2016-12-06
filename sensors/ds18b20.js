var fs = require("fs");

module.exports = function () {
	return new Promise(function (resolve, reject) {
		resolve([
			{
				sensorID: 4,
				value: latestTemp,
				unit: "&#176;C",
				measurement: "Temperature",
				location: "Soil",
				htmlDecimal: 1
			}
		]);
	});
}
