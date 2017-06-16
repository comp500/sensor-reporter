module.exports = {
	0: { // ambientTemperature
		graphDecimal: 1,
		exportDecimal: 1,
		unit: "&#176;C",
		measurement: "Temperature",
		location: "Geography office",
		htmlDecimal: 1,
		graphMin: 0,
		graphMax: 35
	},
	1: { // humidity
		graphDecimal: 0,
		exportDecimal: 0,
		unit: "%",
		measurement: "Humidity",
		location: "Geography office",
		htmlDecimal: 1,
		graphMin: 10,
		graphMax: 95
	},
	2: { // pressure
		graphDecimal: 0,
		exportDecimal: 0,
		unit: "hPa",
		small: true,
		measurement: "Pressure",
		location: "Geography office",
		htmlDecimal: 0,
		graphMin: 990,
		graphMax: 1040
	},
	// TODO: add external temperature sensor (ID 3)
	4: { // light
		graphDecimal: 0,
		exportDecimal: 0,
		unit: "lx",
		small: true,
		measurement: "Light",
		location: "Geography office",
		htmlDecimal: 0,
		graphMin: 0,
		graphMax: 65535
	}
};
