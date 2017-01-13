var optional = require("optional");
var promises;

module.exports = {};
module.exports.load = new Promise(function (resolve, reject) {
	process.nextTick(function () {
		promises = [
			optional("./bme280.js"),
			optional("./ds18b20.js")
		];
		resolve();
	});
});

module.exports.run = new Promise(function (resolve, reject) {
	Promise.all(promises).then(function (values) {
		var sensors = [];
		for (var i = 0; i < values.length; i++) {
			sensors.concat(values[i]);
		}
		resolve(sensors);
	}).catch(function (reason) {
		reject(reason);
	});
});
