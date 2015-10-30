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

// function seedBatteries() {
//     Battery.find({}).exec(function(err, batteries) {
//        if (batteries.length === 0) {           
           
//            var battery1 = new Battery({ number: 1, name: 'ONBO 3S 20C 1350mah' });
//            battery1.cycles.push({ battery: battery1._id, comment: 'Just some comment' });
//            battery1.save(function (err) {
//               if (err) {
//                   console.log('err: ' + err);
//               }
//               console.log('success!');
//            });
//        }       
//     });
// }
