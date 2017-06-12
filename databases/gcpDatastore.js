// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GCLOUD_PROJECT environment variable. See
// https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/latest/guides/authentication
const Datastore = require('@google-cloud/datastore');

// Instantiates a client
const datastore;

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

module.exports.pushData = function (values) { // add new data, as JSON
	return new Promise(function (resolve, reject) {
		var taskKey = datastore.key('Measurement'); // get key
		var entity = { // TODO change to a function which translates?
			key: taskKey,
			data: [
				{
					name: 'recorded',
					value: values.time.toJSON() // for indexing
				},
				{
					name: 'data',
					value: values, // sub entity JSON
					excludeFromIndexes: true
				}
			]
		};
		resolve(datastore.save(entity));
	});
};

module.exports.getGraphs = function () { // get graphs TODO: specify time/date
	return new Promise(function (resolve, reject) {
		
	});
};

module.exports.getExportAll = function () { // get all data in database
	return new Promise(function (resolve, reject) {
		
	});
};

module.exports.getExportBetweenDates = function (dateStart, dateEnd) { // get data between dates
	return new Promise(function (resolve, reject) {
		
	});
};