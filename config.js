module.exports = {
	baroInterval: 60 * 1000, // 1 minute readings for Pressure
	tempInterval: 60 * 1000, // 1 minute readings for Temperature
	humiInterval: 60 * 1000, // 1 minute readings for Humidity
	ambientTemperature: {
		graphDecimal: 1,
		exportDecimal: 1
	},
	pressure: {
		graphDecimal: 0,
		exportDecimal: 0
	},
	humidity: {
		graphDecimal: 0,
		exportDecimal: 0
	},
};
