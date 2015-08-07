(function() {
    'use strict';

    var express = require('express');

	var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

	var app = express();

	// ----------------------

	var config = require('./config/config.js')[env];

	require('./config/express')(app, config);

	// require('./server/config/mongoose')(config);

	// require('./server/config/passport')();

	require('./config/routes')(app, config);

	// ----------------------

	app.listen(config.port);

	console.log('Listening on port ' + config.port);
	console.log(
		'env = ' + env +
		'\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd());
		
	console.log('_o\\   \\o|   |o|   |o/   /o_');

}());