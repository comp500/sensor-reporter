var express = require('express');
var app = express();
var BME280 = require('node-bme280');
var barometer = new BME280({address: 0x77});
 
barometer.begin(function(err) {
    if (err) {
        console.info('error initializing barometer', err);
        return;
    }
    console.info('barometer running');
});

app.get('/', function (req, res) {
	barometer.readPressureAndTemparature(function(err, pressure, temperature, humidity) {
		res.write("Temperature: " + temperature.toFixed(2) + "℃\n");
		res.write("Pressure: " + (pressure / 100).toFixed(2) + "hPa\n");
		res.write("Humidity: " + humidity.toFixed(2) + "%\n");
		res.end();
	});
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
