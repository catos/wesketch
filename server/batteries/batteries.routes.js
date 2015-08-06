// battery.routes.js
(function() {
	'use strict';

	module.exports = function (app) {

	    app.get('/api/batteries', function(req, res) {
        	res.send('Welcome to: /api/batteries');	        
	    });


	};
}());
