var fs = require("fs");
var glob = require("glob");

module.exports = function () {
	glob("/sys/bus/w1/devices/28*/w1_slave", function (er, files) {
		return new Promise(function (resolve, reject) {
			fs.readFile('/etc/hosts', 'utf8', function (err,data) {
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
