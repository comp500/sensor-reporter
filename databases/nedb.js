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
	
};

module.exports.getGraphs = function () { // get graphs TODO: specify time/date
	
};

module.exports.getExportAll = function () { // get all data in database
	
};

module.exports.getExportBetweenDates = function (dateStart, dateEnd) { // get data between dates
	
};