var Battery = require('./batteries.model');

module.exports = {

    init: function (req, res, next) {
        seedBatteries();

        next();
    },

    index: function (req, res, next) {
        Battery
            .find({})
            .limit(10)
            .sort({ number: -1 })
            .exec(function callback(err, data) {
                if (err) {
                    return next(err);
                }
                res.json(data);
            });

    },

    get: function (req, res, next) {
        if (req.params.batteriesId !== '0') {
            Battery
                .findOne({ '_id': req.params.batteriesId })
                .populate('cycles')
                .exec(function callback(err, data) {
                    if (err) {
                        return next(err);
                    }

                    res.json(data);
                });
        } else {
            res.json(new Battery());
        }
    },

    update: function (req, res, next) {
        Battery.findByIdAndUpdate(req.params.batteriesId, req.body, { new: true }, function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    },

    create: function (req, res, next) {
        Battery.create(req.body, function (err, data) {
            if (err) {
                return next(err);
            }

            res.json(data);
        });
    },

    destroy: function (req, res, next) {
        Battery.findByIdAndRemove(req.params.batteriesId, req.body, function (err, data) {
            if (err) {
                return next(err);
            }

            res.json(data);
        });
    }
};

function seedBatteries() {
    Battery.find({}).exec(function(err, batteries) {
       if (batteries.length === 0) {           
           
           var battery1 = new Battery({ number: 1, name: 'ONBO 3S 20C 1350mah' });
           battery1.cycles.push({ battery: battery1._id, comment: 'Just some comment' });
           battery1.save(function (err) {
              if (err) {
                  console.log('err: ' + err);
              }
              console.log('success!');
           });
       }       
    });
}
