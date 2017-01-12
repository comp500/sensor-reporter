var express = require('express');
var exphbs  = require('express-handlebars');
var config = require('./config.js');
var app = express();
var BME280 = require('node-bme280');
var barometer = new BME280({address: 0x77});
var latestTemp;
var latestPressure;
var latestHumidity;
var latestTime;
var ready = false;

var Datastore = require('nedb');
var dateFormat = require('dateformat');
var open = new Date();
var db = new Datastore({ filename: 'latest.txt', autoload: true }); // 1 min, rename to dbLatest
var dbDaily = new Datastore({ filename: dateFormat(open, "yyyy-mm-dd'T00:00:00'") + "day.txt", autoload: true }); // 5 mins
var dbWeekly = new Datastore({ filename: dateFormat(open, "yyyy-mm-dd'T00:00:00'") + "week.txt", autoload: true }); // 1 hour
 
barometer.begin(function (err) {
    if (err) {
        console.info('error initializing barometer', err);
        return;
    }
    console.info('barometer running');
	setImmediate(readData);
	setInterval(readData, config.baroInterval);
});

var counter = 0;

var readData = function () {
	barometer.readPressureAndTemparature(function(err, pressure, temperature, humidity) {
		latestTime = new Date();
		latestTemp = temperature.toFixed(2);
		latestPressure = (pressure / 100).toFixed(2);
		latestHumidity = humidity.toFixed(2);
		ready = true;
		db.insert({
			time: latestTime,
			ambientTemperature: latestTemp,
			pressure: latestPressure,
			humidity: latestHumidity
		});
	});
};

var consolidate = function (type) {
	if (type == "day") {
		
	} else if (type == "week") {
		
	}
};

app.engine('handlebars', exphbs({defaultLayout: false}));
app.set('view engine', 'handlebars');
app.use(express.static('static'));

app.get('/', function (req, res) {
	if (ready) {
		var now = new Date();
		var secondsPast = (now.getTime() - latestTime.getTime()) / 1000;
		res.render("index", {
			ready: true,
			graphtest: req.query.graphtest,
			measurementTime: secondsPast.toFixed(0),
			sensors: [
				{
					value: parseFloat(latestTemp).toFixed(1),
					unit: "&#176;C",
					measurement: "Temperature",
					location: "ICT office"
				},
				{
					value: parseFloat(latestHumidity).toFixed(1),
					unit: "%",
					measurement: "Humidity",
					location: "ICT office"
				},
				{
					value: parseFloat(latestPressure).toFixed(0),
					unit: "hPa",
					small: true,
					measurement: "Pressure",
					location: "ICT office"
				}
			]
		});
	} else {
		res.render("index", {
			ready: false,
			graphtest: req.query.graphtest
		});
	}
});

app.get('/output.csv', function (req, res) {
	db.find({}).sort({ time: 1 }).exec(function (err, docs) {
		res.write("Time,Temperature,Pressure,Humidity\n");
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
		res.end();
	});
});

app.get('/data.json', function (req, res) {
	db.find({ $where: function () {return (this.time % 5) == 0} }).sort({ time: -1 }).limit(20).exec(function (err, docs) {
		var dataObject = {
			ambientTemperature: [],
			pressure: [],
			humidity: []
		};
		for (var i = 0; i < docs.length; i++) {
			res.write(docs[i].ambientTemperature);
			dataObject.ambientTemperature.push(docs[i].ambientTemperature);
			dataObject.pressure.push(docs[i].pressure);
			dataObject.humidity.push(docs[i].humidity);
		}
		res.send(JSON.stringify(dataObject));
	});
});

app.listen(80, function () {
	console.log('Weather station online on port 80');
});
