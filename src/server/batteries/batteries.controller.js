var Battery = require('./batteries.model');

module.exports = {

    init: function (req, res, next) {
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
        Battery
            .findOne({ '_id': req.params.id })
            .exec(function callback(err, data) {
                if (err) {
                    return next(err);
                }

                res.json(data);
            });
    },

    update: function (req, res, next) {
        Battery.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, data) {
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
        Battery.findByIdAndRemove(req.params.id, req.body, function (err, data) {
            if (err) {
                return next(err);                
            }

            res.json(data);
        });
    }
};