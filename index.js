var express = require('express');
var app = express();
var BME280 = require('node-bme280');
var barometer = new BME280({address: 0x77});
var latestTemp;
var latestPressure;
var latestHumidity;
var ready = false;

var Datastore = require('nedb')
  , db = new Datastore({ filename: 'data.txt', autoload: true });
 
barometer.begin(function(err) {
    if (err) {
        console.info('error initializing barometer', err);
        return;
    }
    console.info('barometer running');
	setImmediate(readData);
	setInterval(readData, 60 * 1000);
});

var readData = function () {
	barometer.readPressureAndTemparature(function(err, pressure, temperature, humidity) {
		latestTemp = temperature.toFixed(2);
		latestPressure = (pressure / 100).toFixed(2);
		latestHumidity = humidity.toFixed(2);
		ready = true;
		db.insert({
			time: new Date(),
			ambientTemperature: latestTemp,
			pressure: latestPressure,
			humidity: latestHumidity
		});
	});
};

app.get('/', function (req, res) {
	res.write("<html><head><meta http-equiv=\"refresh\" content=\"5\"><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></head><body>");
	if (ready) {
		res.write("Temperature: " + latestTemp + " ℃<br>");
		res.write("Pressure: " + latestPressure + " hPa<br>");
		res.write("Humidity: " + latestHumidity + "%\n");
	} else {
		res.write("No data is available currently.");
	}
	res.end("</body></html>");
});

app.listen(80, function () {
	console.log('Example app listening on port 80!');
});
