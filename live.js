// A module to transfer data between logging system and website
var ready = false;
var latestSensors = {};
var commitHash = null;

module.exports = {};

// Has a recording been sent yet?
module.exports.getReadyStatus = function () {
	return ready;
};

// What is the latest recording?
module.exports.getLatest = function () {
	if (ready) {
		return latestSensors;
	} else {
		return false;
	}
};

// Set the latest recording
module.exports.setLatest = function (data) {
	latestSensors = data;
	ready = true;
};

// Get the commit hash
module.exports.getCommitHash = function () {
	return commitHash;
};

// Set the commit hash
module.exports.setCommitHash = function (data) {
	commitHash = data;
};