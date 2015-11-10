(function () {
    'use strict';

    var express = require('express');
	var env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
	var app = express();

	/**
	 * Config
	 */
	var settings = require('./config/settings.js')[env];

	require('./config/express')(app, settings);

	require('./config/mongoose')(settings);

	require('./config/passport')();

	require('./config/routes')(app, settings);

	require('./config/errors')(app);

	/**
	 * Initialization
	 */
	require('./api/users/users.seed.js')();

	/**
	 * Start server
	 */
	app.listen(settings.port);

	console.log('Listening on port ' + settings.port);
	console.log('\tenv = ' + env + '\n\t__dirname = ' + __dirname + '\n\tprocess.cwd = ' + process.cwd());
	console.log('_o\\   \\o|   |o|   |o/   /o_');

} ());