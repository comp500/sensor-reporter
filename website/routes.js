module.exports = function (app) {
	app.get('/', function (req, res) { // homepage
		if (ready) {
			var now = new Date(); // get current time
			var secondsPast = (now.getTime() - latestSensors.time.getTime()) / 1000; // get seconds from recorded time
			res.render("index", { // display ready page with sensor data
				ready: true,
				measurementTime: secondsPast.toFixed(0),
				sensors: mergeConfig(latestSensors, "htmlDecimal"),
				commitHash: commitHash
			});
		} else {
			res.render("index", { // show not ready page
				ready: false
			});
		}
	});

	app.get('/output.csv', function (req, res) { // for export csv file
		if (databaseReady) {
			db.getExportAll().then(function (docs) {
				var titles = "Time";
				Object.keys(config).forEach(function (key) {
					titles += "," + config[key].measurement;
				});
				res.write(titles + "\n"); // titles
				for (let i = 0; i < docs.length; i++) { // for every document
					var time = docs[i].time; // time when recorded
					var formattedDate = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate(); // format time/date for excel format
					var formattedTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
					var formattedDateTime = formattedDate + " " + formattedTime; // github doesn't like long lines
					res.write(formattedDateTime + ","); // write time/date
					// write sensor data
					var sensorData = mergeConfig(docs[i], "exportDecimal");
					for (let i = 0; i < sensorData.length; i++) {
						if (i == (sensorData.length - 1)) {
							res.write(sensorData[i] + "\n");
						} else {
							res.write(sensorData[i] + ",");
						}
					}
				}
				res.end(); // end response
			}); // TODO catch with appropriate logging api?
		}
	});

	app.get('/data.json', function (req, res) {
		if (databaseReady) {
			var graphLength = 200;
			db.getGraphs(graphLength).then(function (docs) {
				var dataObject = { // output object
					metadata: [],
					values: {}
				};
				var average = {}; // running mean object
				Object.keys(config).forEach(function (key) { // build metadata
					dataObject.metadata.push({ // data for graphs
						unit: config[key].unit,
						measurement: config[key].measurement,
						min: config[key].graphMin,
						max: config[key].graphMax,
						sensorID: key
					});
					dataObject.values[key] = []; // initialise array
					average[key] = 0; // set average to 0
				});
				for (var i = 0; i < docs.length; i++) {
					Object.keys(docs[i]).forEach(function (key) { // add to mean
						if (isNaN(parseInt(key, 10))) {
							// ignore
						} else if (config[key] == null) {
							console.error("Data value "+ key +" not found in configuration");
						} else {
							average[key] += parseFloat(docs[i][key]);
						}
					});
					if ((i % 5) == 4) { // every 5 minutes
						Object.keys(average).forEach(function (key) { // calculate means
							var averageCalculated = average[key] / 5;
							dataObject.values[key].push(averageCalculated.toFixed(config[key].graphDecimal)); // add to values
							average[key] = 0; // reset average
						});
					}
				}
				if (docs.length < graphLength) {
					Object.keys(dataObject.values).forEach(function (key) {
						while (dataObject.values[key].length < (graphLength / 5)) {
							dataObject.values[key].unshift(null);
						}
					});
				}
				res.send(JSON.stringify(dataObject)); // send data
			});
		}
	});
}