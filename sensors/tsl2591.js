var tsl2591 = require('tsl2591');

/* Use /dev/i2c-0 on older Raspis */
/* Note the options are passed directly to the i2c module */
var light = new tsl2591({device: '/dev/i2c-1'});

module.exports = {};

module.exports.load = function () {
	return new Promise(function (resolve, reject) {
		
	});
}
light.init({AGAIN: 2, ATIME: 1}, function(err) {
    if (err) {
        console.log(err);
        process.exit(-1);
    } else {
        console.log('TSL2591 ready');
        setInterval(function() {
            light.readLuminosity(function(err, data) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(data);
            }
            var raw = data.vis_ir;
            console.log(data.vis_ir);
            });
        }, 1000);
    }
});

module.exports.getData = function () {
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
