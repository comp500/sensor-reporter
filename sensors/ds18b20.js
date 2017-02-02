var fs = require("fs");
var glob = require("glob");

module.exports = function () {
	glob("/sys/bus/w1/devices/28*/w1_slave", function (er, files) {
		return new Promise(function (resolve, reject) {
			if (files.length < 1) {
				reject("Device not found. Try starting up the kernel modules.");
			}
			fs.readFile(files[0], 'utf8', function (err,data) {
				if (err) {
				return console.log(err);
				}
				console.log(data);
			});
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
	});
}
// im a bad programmer
