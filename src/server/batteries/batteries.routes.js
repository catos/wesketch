(function () {
	'use strict';

	var express = require('express'),
		router = express.Router(),
		batteries = require('./batteries.controller');


	router.all('*', batteries.init);
	router.get('/', batteries.get)
	router.put('/', batteries.put)
	router.post('/', batteries.post);
	router.delete('/', batteries.delete);


	module.exports = router;

} ());
