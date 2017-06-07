var optional = require("optional");
var promises;

module.exports = {};
module.exports.load = function () { // load all modules
	return new Promise(function (resolve, reject) {
		process.nextTick(function () { // wait for some reason
			promises = [ // list of all modules to be loaded
				optional("./bme280.js"),
//				optional("./ds18b20.js"),
				optional("./tsl2591.js")
			];
			var calledPromises = []; // array of promise callbacks
			for (var i = 0; i < promises.length; i++) { // loop through all modules
				calledPromises[i] = promises[i].load(); // run all modules
			}
			// resolve once all promises are called
			resolve(Promise.all(calledPromises));
		});
	});
};

module.exports.run = function () { // run all modules
	return new Promise(function (resolve, reject) {
		var calledPromises = []; // array of promise callbacks
		for (var i = 0; i < promises.length; i++) { // loop through all modules
			calledPromises[i] = promises[i].getData(); // run all modules
		}
		Promise.all(calledPromises).then(function (values) {
			var sensors = []; // array for sensor values
			for (var i = 0; i < values.length; i++) {
				sensors = sensors.concat(values[i]); // add callback values to array
			}
			resolve(sensors); // resolve array
		}).catch(function (reason) {
			reject(reason); // reject if error
		});
	});
};
