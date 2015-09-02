var mongoose = require('mongoose');

var batterySchema = new mongoose.Schema({
    number: { type: Number, required: true },
    name: { type: String, required: true },
    cycles: [{
        created: { type: Date, default: Date.now },
        comment: String
    }],
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Battery', batterySchema);
