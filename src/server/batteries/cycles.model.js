var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Battery = require('./batteries.model');

var CycleSchema = new mongoose.Schema({
	battery: { type: Schema.Types.ObjectId, ref: 'Battery' },
	created: { type: Date, default: Date.now },
	comment: String
});

module.exports = mongoose.model('Cycle', CycleSchema);
