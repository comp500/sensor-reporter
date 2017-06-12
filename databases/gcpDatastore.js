// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GCLOUD_PROJECT environment variable. See
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/latest/guides/authentication
const Datastore = require('@google-cloud/datastore');

// Instantiates a client
var datastore;

module.exports = {};
module.exports.connect = function () { // connect to database
	return new Promise(function (resolve, reject) {
		try {
			datastore = Datastore(); // initialise database
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

var serialize = function (values, taskKey) {
	var data = [];
	data.push({
		name: 'recorded',
		value: values.time.toJSON() // for indexing
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

module.exports.pushData = function (values) { // add new data, as JSON
	return new Promise(function (resolve, reject) {
		var taskKey = datastore.key('Measurement'); // get key
		resolve(datastore.save(serialize(values, taskKey)));
	});
};

module.exports.getGraphs = function () { // get graphs TODO: specify time/date
	return new Promise(function (resolve, reject) {
		
	});
};

module.exports.getExportAll = function () { // get all data in database
	return new Promise(function (resolve, reject) {
		var query = datastore.createQuery('Measurement').order('recorded');
		datastore.runQuery(query).then(function (results) {
			resolve(deserializeMultiple(results[0]));
		}).catch(function () {
			reject();
		});
	});
};

module.exports.getExportBetweenDates = function (dateStart, dateEnd) { // get data between dates
	return new Promise(function (resolve, reject) {
		
	});
};