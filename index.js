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

app.get('/output.csv', function (req, res) {
	db.find({}, function (err, docs) {
		for (var i = 0; i < docs.length; i++) {
			var time = docs[i].time;
			var formattedDate = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
			var formattedTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
			var formattedDateTime = formattedDate + " " + formattedTime; // github doesn't like long lines
			res.write(formattedDateTime + ",");
			res.write(docs[i].ambientTemperature + ",");
			res.write(docs[i].pressure + ",");
			res.write(docs[i].humidity + "\n");
		}
	});
});

app.listen(80, function () {
	console.log('Example app listening on port 80!');
});
