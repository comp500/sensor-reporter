var optional = require("optional");

var promises = [
	optional("./bme280.js"),
	optional("./ds18b20.js")
];

module.exports = new Promise(function (resolve, reject) {
	
});
