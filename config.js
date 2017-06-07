module.exports = {
	0: { // ambientTemperature
		graphDecimal: 1,
		exportDecimal: 1,
		interval: 60 * 1000, // 1 minute readings for Temperature
		unit: "&#176;C",
		measurement: "Temperature",
		location: "ICT office",
		htmlDecimal: 1
	},
	1: { // humidity
		graphDecimal: 0,
		exportDecimal: 0,
		interval: 60 * 1000, // 1 minute readings for Humidity
		unit: "%",
		measurement: "Humidity",
		location: "ICT office",
		htmlDecimal: 1
	},
	2: { // pressure
		graphDecimal: 0,
		exportDecimal: 0,
		interval: 60 * 1000, // 1 minute readings for Pressure
		unit: "hPa",
		small: true,
		measurement: "Pressure",
		location: "ICT office",
		htmlDecimal: 0
	},
	// TODO: add external temperature sensor (ID 3)
	4: { // light
		graphDecimal: 0,
		exportDecimal: 0,
		interval: 60 * 1000, // 1 minute readings
		unit: "lx",
		measurement: "Light",
		location: "ICT office",
		htmlDecimal: 0
	}
};
