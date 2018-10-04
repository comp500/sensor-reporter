var PubNub = require('pubnub');

var pubnub;

module.exports = {};
module.exports.connect = function () { // connect to database
	return new Promise(function (resolve, reject) {
		try {
			var settings = require('../pubnub-config.json');
			pubnub = new PubNub(settings);
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

module.exports.pushData = function (values) { // add new data, as JSON
	return new Promise(function (resolve, reject) {
		pubnub.publish({
				message: values,
				channel: 'measurement'
			}, function (status, response) {
				if (status.error) {
					reject(status.error);
				} else {
					resolve();
				}
			}
		);
	});
};