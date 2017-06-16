// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GCLOUD_PROJECT environment variable. See
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/latest/guides/authentication
const Datastore = require('@google-cloud/datastore');

// Instantiates a client
var datastore;
var ready = false;

module.exports = {};
module.exports.connect = function () { // connect to database
	return new Promise(function (resolve, reject) {
		try {
			datastore = Datastore({
				keyFilename: '../weather-station-keys.json'
			}); // initialise database
			ready = true;
			resolve();
		} catch (e) {
			ready = false;
			reject(e);
		}
	});
};

var serialize = function (values, taskKey) {
	var data = [];
	data.push({
		name: 'recorded',
		value: values.time // for indexing
	});
	Object.keys(values).forEach(function (key) { // add to mean
		if (isNaN(parseInt(key, 10))) {
			// ignore
		} else {
			data.push({
				name: key,
				value: values[key] // maybe don't index?
			});
		}
	});
	return {
		key: taskKey,
		data: data
	};
};

var deserialize = function (entity) {
	if (entity.recorded != null) {
		entity.time = new Date(entity.recorded);
		delete entity.recorded;
	}
	return entity;
};

var deserializeMultiple = function (entities) {
	var values = [];
	for (var i = 0; i < entities.length; i++) {
		values.push(deserialize(entities[i]));
	}
	return values;
};

module.exports.getReadyStatus = function () { // return database ready status
	return ready;
};

module.exports.pushData = function (values) { // add new data, as JSON
	return new Promise(function (resolve, reject) {
		var taskKey = datastore.key('Measurement'); // get key
		resolve(datastore.save(serialize(values, taskKey)));
	});
};

module.exports.getGraphs = function (graphLength) { // get graphs TODO: specify time/date
	return new Promise(function (resolve, reject) {
		var query = datastore.createQuery('Measurement')
			.order('recorded', {
				descending: true
			}).limit(graphLength);
		datastore.runQuery(query).then(function (results) {
			resolve(deserializeMultiple(results[0]).reverse()); // reverse order
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports.getExportAll = function () { // get all data in database
	return new Promise(function (resolve, reject) {
		var query = datastore.createQuery('Measurement').order('recorded');
		datastore.runQuery(query).then(function (results) {
			resolve(deserializeMultiple(results[0]));
		}).catch(function (err) {
			reject(err);
		});
	});
};

module.exports.getExportBetweenDates = function (dateStart, dateEnd) { // get data between dates
	return new Promise(function (resolve, reject) {
		var query = datastore.createQuery('Measurement')
			.filter('recorded', '>', dateStart)
			.filter('recorded', '<', dateEnd)
			.order('recorded');
		datastore.runQuery(query).then(function (results) {
			resolve(deserializeMultiple(results[0]));
		}).catch(function (err) {
			reject(err);
		});
	});
};