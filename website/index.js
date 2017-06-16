module.exports = function (sensorConfig, config, db, live) {
	// load modules
	const express = require('express');
	const exphbs  = require('express-handlebars');
	const app = express();
	const compression = require('compression'); // middle-out compression
	const minify = require('express-minify');

	// start handlebars
	app.engine('handlebars', exphbs({defaultLayout: false}));
	app.set('view engine', 'handlebars');
	app.use(compression()); // use compression
	app.use('/src/css', express.static('./node_modules/bootstrap/dist/css')); // serve bootstrap
	app.use('/src/js', express.static('./node_modules/chart.js/dist')); // serve chart.js
	app.use(minify()); // use minification
	app.use(express.static('./static')); // use static folder

	require("routes.js")(app, sensorConfig, config, db, live);

	app.listen(config.website.port, function () { // listen on port
		console.log('Weather station online on port ' + config.website.port);
	});
};