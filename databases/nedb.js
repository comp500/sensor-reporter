var Datastore = require('nedb');
var db = new Datastore({ filename: 'latest2.txt' });

module.exports = {};
module.exports.connect = function () { // connect to database
	return new Promise(function (resolve, reject) {
		db.loadDatabase(function (err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
};

module.exports.pushData = function (values) { // add new data, as JSON
	return new Promise(function (resolve, reject) {
		db.insert(values, function (err, newDoc) {
			if (err) {
				reject(err);
			} else {
				resolve(newDoc);
			}
		});
	});
};

module.exports.getGraphs = function () { // get graphs TODO: specify time/date
	return new Promise(function (resolve, reject) {
		db.find({}).sort({ time: -1 }).limit(100).exec(function (err, docs) { // query 100 newest entries, newest first
			if (err) {
				reject(err);
			} else {
				resolve(docs.reverse()); // reverse order, oldest first in graph data
			}
		});
	});
};

module.exports.getExportAll = function () { // get all data in database
	return new Promise(function (resolve, reject) {
		db.find({}).sort({ time: 1 }).exec(function (err, docs) { // find all records and sort
			if (err) {
				reject(err);
			} else {
				resolve(docs);
			}
		});
	});
};

module.exports.getExportBetweenDates = function (dateStart, dateEnd) { // get data between dates
	return new Promise(function (resolve, reject) {
		db.find({ time: { $gte: dateStart, $lte: dateEnd } }).sort({ time: 1 }).exec(function (err, docs) { // find records after/before dates and sort
			if (err) {
				reject(err);
			} else {
				resolve(docs);
			}
		});
	});
};