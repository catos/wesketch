var mongoose = require('mongoose');

var BatterySchema = new mongoose.Schema({
    number: { type: Number, required: true },
    name: { type: String, required: true },
    cycles: { type: Number, default: 1 },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Battery', BatterySchema);