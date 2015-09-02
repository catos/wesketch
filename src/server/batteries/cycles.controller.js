var Cycle = require('./cycles.model'),
    Battery = require('./batteries.model');

module.exports = {

    init: function (req, res, next) {
        next();
    },

    index: function (req, res, next) {
        console.log(req.params);
        Cycle
            .find({ 'battery': req.params.batteriesId })
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
        console.log('req.params: ', req.params);
        if (req.params.cyclesId !== '0') {
            Cycle
                .findOne({ '_id': req.params.cyclesId })
                .exec(function callback(err, data) {
                    if (err) {
                        return next(err);
                    }

                    res.json(data);
                });
        } else {
            res.json(new Cycle());
        }
    },

    update: function (req, res, next) {
        Cycle.findByIdAndUpdate(req.params.cyclesId, req.body, { new: true }, function (err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    },

    create: function (req, res, next) {
        var cycle = req.body;

        cycle.battery = req.params.batteriesId;

        Cycle.create(cycle, function (err, data) {
            if (err) {
                return next(err);
            }

            res.json(data);
        });
    },

    destroy: function (req, res, next) {
        Cycle.findByIdAndRemove(req.params.cyclesId, req.body, function (err, data) {
            if (err) {
                return next(err);
            }

            res.json(data);
        });
    }
};