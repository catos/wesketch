var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Cycle = require('./cycles.model');

var BatterySchema = new mongoose.Schema({
    number: { type: Number, required: true },
    name: { type: String, required: true },
    cycles: [{ type: Schema.Types.ObjectId, ref: 'Cycle' }],
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Battery', BatterySchema);
