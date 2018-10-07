module.exports = {
	recordInterval: 60 * 1000, // 1 minute readings
	storeCron: "*/30 * * * *", // Store average every 30 readings
	decimalPlaces: {
		0: 2,
		1: 2,
		2: 2,
		4: 0
	}
};
