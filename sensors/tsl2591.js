var tsl2591 = require('tsl2591');

/* Use /dev/i2c-0 on older Raspis */
/* Note the options are passed directly to the i2c module */
var light = new tsl2591({device: '/dev/i2c-1'});

module.exports = {};

module.exports.load = function () {
	return new Promise(function (resolve, reject) {
		light.init({AGAIN: 2, ATIME: 1}, function(err) {
			if (err) {
				reject(err);
			} else {
				console.log('TSL2591 ready');
				resolve();
			}
		});
	});
}

module.exports.getData = function () {
	return new Promise(function (resolve, reject) {
		light.readLuminosity(function(err, data) {
            if (err) {
                reject(err);
            } else {
				if (data.vis_ir == 0) {
					resolve(module.exports.getData());
				} else {
					console.log(data);
					resolve([
						{
							sensorID: 5,
							value: data.vis_ir,
							unit: "lx",
							measurement: "Light",
							location: "ICT office",
							htmlDecimal: 0
						}
					]);
				}
            }
        });
	});
}
