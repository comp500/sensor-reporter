var fs = require("fs");
var glob = require("glob");
var fileName = null;

module.exports = {};

module.exports.load = function () {
	return new Promise(function (resolve, reject) {
		glob("/sys/bus/w1/devices/28*/w1_slave", function (er, files) {
			if (files.length < 1) {
				reject("Device not found. Try starting up the kernel modules.");
			} else {
				fileName = files[0];
				if (files.length > 1) {
					console.info("Multiple devices found. Readings may be incorrect.");
				}
				resolve();
			}
		});
	});
};

module.exports.getData = function () {
	return new Promise(function (resolve, reject) {
		if (fileName == null) {
			reject("fileName not loaded");
		}
		fs.readFile(fileName, 'utf8', function (err, data) {
			if (err) {
			return console.log(err);
			}
			console.log(data);
		});
		// TODO: Parse file
		/*resolve([
			{
				sensorID: 3,
				value: latestTemp,
				unit: "&#176;C",
				measurement: "Temperature",
				location: "Soil",
				htmlDecimal: 1
			}
		]);*/
	});
};