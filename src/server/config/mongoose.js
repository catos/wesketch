var mongoose = require('mongoose');

module.exports = function (settings) {
	mongoose.connect(settings.db);

	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'MongoDB connection error...'));

	db.once('open', function callback() {
		console.log('Database opened');
	});

};
