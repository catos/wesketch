(function () {
	'use strict';

	var express = require('express'),
		router = express.Router(),
		batteries = require('./batteries.controller');

	// middleware specific to this router
	// router.use(function timeLog(req, res, next) {
	// 	console.log('WTB Authentication here ? time: ', Date.now());
	// 	next();
	// });

	// router.route('/batteries/:battery_id')
	// 	.all(batteries.init)
	// 	.get(batteries.get);
		
	// console.log('batteries.router');

	router.route('/batteries');
	router.all(batteries.init);
	router.get(batteries.get);
	
	// // define the home page route
	// router.get('/batteries', function(req, res) {
	// 	// res.json({ message: 'Batteries /' });
	// 	batteries.get(req, res);
	// });
	
	// // define the about route
	// router.get('/about', function(req, res) {
	// 	res.send('About batteries');
	// });

	module.exports = router;

} ());
