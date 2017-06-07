// load modules
const express = require('express');
const exphbs  = require('express-handlebars');
const config = require('./config.js');
const app = express();
const sensors = require('./sensors/index.js');

// define variables
var latestSensors;
var ready = false;

// open datastores
var Datastore = require('nedb');
var dateFormat = require('dateformat');
var open = new Date();
var db = new Datastore({ filename: 'latest2.txt', autoload: true }); // TODO: rename to dbLatest
//var dbDaily = new Datastore({ filename: dateFormat(open, "yyyy-mm-dd'T00:00:00'") + "day.txt", autoload: true });
//var dbWeekly = new Datastore({ filename: dateFormat(open, "yyyy-mm-dd'T00:00:00'") + "week.txt", autoload: true }); // TODO: fix file name for each week not day

sensors.load().then(function () {
	// read first measurement immediately
	setImmediate(readData);
	// read measurements on interval
	setInterval(readData, config[0].interval);
}).catch(function (err) {
	console.error(err);
	return;
});

var readData = function () {
	// read data from sensors
	sensors.run().then(function (values) {
		values.time = new Date();
		//latestTemp = temperature.toFixed(2); // store to 2dp TODO: make this use config file
		//latestPressure = (pressure / 100).toFixed(2);
		//latestHumidity = humidity.toFixed(2);
		latestSensors = values; // TODO: fix decimal places
		db.insert(values);
		ready = true;
	}).catch(function (err) {
		console.error(err);
		return;
	});
};

var consolidate = function (type) { // not done
	if (type == "day") {
	} else if (type == "week") {
	};
};

// start handlebars
app.engine('handlebars', exphbs({defaultLayout: false}));
app.set('view engine', 'handlebars');
app.use(express.static('static')); // use static folder

app.get('/', function (req, res) { // homepage
	if (ready) {
		var now = new Date(); // get current time
		var secondsPast = (now.getTime() - latestTime.getTime()) / 1000; // get seconds from recorded time
		res.render("index", { // display ready page with sensor data
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
		res.render("index", { // show not ready page
			ready: false,
			graphtest: req.query.graphtest
		});
	};
});

app.get('/output.csv', function (req, res) { // for export csv file
	db.find({}).sort({ time: 1 }).exec(function (err, docs) { // find all records and sort
		res.write("Time,Temperature,Pressure,Humidity\n"); // titles
		for (var i = 0; i < docs.length; i++) { // for every document
			var time = docs[i].time; // time when recorded
			var formattedDate = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate(); // format time/date for excel format
			var formattedTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
			var formattedDateTime = formattedDate + " " + formattedTime; // github doesn't like long lines
			res.write(formattedDateTime + ","); // write time/date
			// write sensor data
			res.write(parseFloat(docs[i].ambientTemperature).toFixed(config.ambientTemperature.exportDecimal) + ",");
			res.write(parseFloat(docs[i].pressure).toFixed(config.pressure.exportDecimal) + ",");
			res.write(parseFloat(docs[i].humidity).toFixed(config.humidity.exportDecimal) + "\n");
		}
		res.end(); // end response
	});
});

app.get('/data.json', function (req, res) {
	db.find({}).sort({ time: -1 }).limit(100).exec(function (err, docs) { // query 100 newest entries, newest first
		var dataObject = { // output object
			ambientTemperature: [],
			pressure: [],
			humidity: []
		};
		var average = { // running mean object
			ambientTemperature: 0,
			pressure: 0,
			humidity: 0
		};
		for (var i = 0; i < docs.length; i++) {
			average.ambientTemperature += parseFloat(docs[i].ambientTemperature); // add data to mean object
			average.pressure += parseFloat(docs[i].pressure);
			average.humidity += parseFloat(docs[i].humidity);
			if ((i % 5) == 4) { // every 5 minutes
				var meanAmbientTemperature = average.ambientTemperature / 5; // calculate means
				var meanPressure = average.pressure / 5;
				var meanHumidity = average.humidity / 5;
				dataObject.ambientTemperature.push(meanAmbientTemperature.toFixed(config.ambientTemperature.graphDecimal)); // push to output
				dataObject.pressure.push(meanPressure.toFixed(config.pressure.graphDecimal));
				dataObject.humidity.push(meanHumidity.toFixed(config.humidity.graphDecimal));
				average = { // reset averages
					ambientTemperature: 0,
					pressure: 0,
					humidity: 0
				};
			}
		}
		console.dir(dataObject);
		res.send(JSON.stringify(dataObject)); // send data
	});
});

app.listen(80, function () { // listen on port 80
	console.log('Weather station online on port 80');
});
