module.exports = function (app, sensorConfig, config, db, live) {
	var mergeConfig = function (data, decimal) {
		var merged = []; // order is implied in export, not needed in live
		Object.keys(sensorConfig).forEach(function (key) { // to ignore a sensor, remove from config
			if (data[key] != null) {
				var rounded = parseFloat(data[key]).toFixed(sensorConfig[key][decimal]); // round to config value
				if (decimal == "exportDecimal") {
					merged.push(rounded); // just push value
				} else if (decimal == "htmlDecimal") {
					var dataOutput = { // data for templating engine
						value: rounded,
						unit: sensorConfig[key].unit,
						measurement: sensorConfig[key].measurement,
						location: sensorConfig[key].location,
						sensorID: key
					};
					if (sensorConfig[key].small == true) { // default is false
						dataOutput.small = true;
					}
					merged.push(dataOutput);
				} else {
					console.error("Invalid rounding value");
				}
			} else {
				console.error("Configured sensor not found in data.");
			}
		});
		return merged;
	};
	
	app.get('/', function (req, res) { // homepage
		if (live.getReadyStatus()) {
			var now = new Date(); // get current time
			var latestSensors = live.getLatest();
			var secondsPast = (now.getTime() - latestSensors.time.getTime()) / 1000; // get seconds from recorded time
			res.render("index", { // display ready page with sensor data
				ready: true,
				measurementTime: secondsPast.toFixed(0),
				sensors: mergeConfig(latestSensors, "htmlDecimal"),
				commitHash: live.getCommitHash()
			});
		} else {
			res.render("index", { // show not ready page
				ready: false
			});
		}
	});

	app.get('/output.csv', function (req, res) { // for export csv file
		if (db.getReadyStatus()) { // TODO backport PHP exports
			db.getExportAll().then(function (docs) {
				var titles = "Time";
				Object.keys(sensorConfig).forEach(function (key) {
					titles += "," + sensorConfig[key].measurement;
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
		if (db.getReadyStatus()) {
			db.getGraphs(config.graphLength).then(function (docs) {
				var dataObject = { // output object
					metadata: [],
					values: {}
				};
				var average = {}; // running mean object
				Object.keys(sensorConfig).forEach(function (key) { // build metadata
					dataObject.metadata.push({ // data for graphs
						unit: sensorConfig[key].unit,
						measurement: sensorConfig[key].measurement,
						min: sensorConfig[key].graphMin,
						max: sensorConfig[key].graphMax,
						sensorID: key
					});
					dataObject.values[key] = []; // initialise array
					average[key] = 0; // set average to 0
				});
				for (var i = 0; i < docs.length; i++) {
					Object.keys(docs[i]).forEach(function (key) { // add to mean
						if (isNaN(parseInt(key, 10))) {
							// ignore
						} else if (sensorConfig[key] == null) {
							console.error("Data value "+ key +" not found in configuration");
						} else {
							average[key] += parseFloat(docs[i][key]);
						}
					});
					if ((i % 5) == 4) { // every 5 minutes
						Object.keys(average).forEach(function (key) { // calculate means
							var averageCalculated = average[key] / 5;
							dataObject.values[key].push(averageCalculated.toFixed(sensorConfig[key].graphDecimal)); // add to values
							average[key] = 0; // reset average
						});
					}
				}
				if (docs.length < config.graphLength) {
					Object.keys(dataObject.values).forEach(function (key) {
						while (dataObject.values[key].length < (config.graphLength / 5)) {
							dataObject.values[key].unshift(null);
						}
					});
				}
				res.send(JSON.stringify(dataObject)); // send data
			});
		}
	});
}