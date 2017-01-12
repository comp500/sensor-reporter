var optional = require("optional");

var promises = [
	optional("./bme280.js"),
	optional("./ds18b20.js")
];

module.exports = {};
module.exports.load = new Promise(function (resolve, reject) {
	
});
