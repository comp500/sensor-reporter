var optional = require("optional");
var promises;

module.exports = {};
module.exports.load = function () {
	return new Promise(function (resolve, reject) {
		process.nextTick(function () {
			promises = [
				optional("./bme280.js")
//				optional("./ds18b20.js")
			];
			var calledPromises = [];
			for (var i = 0; i < promises.length; i++) {
				calledPromises[i] = promises[i].load();
			}
			Promise.all(calledPromises).then(function (values) {
				resolve();
			}).catch(function (reason) {
				reject(reason);
			});
		});
	});
};

module.exports.run = function () {
	return new Promise(function (resolve, reject) {
		var calledPromises = [];
		for (var i = 0; i < promises.length; i++) {
			calledPromises[i] = promises[i].getData();
		}
		Promise.all(calledPromises).then(function (values) {
			var sensors = [];
			console.dir(values);
			for (var i = 0; i < values.length; i++) {
				sensors.concat(values[i]);
			}
			resolve(sensors);
		}).catch(function (reason) {
			reject(reason);
		});
	});
};
