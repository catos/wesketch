var Battery = require('./batteries.model');

module.exports = {

    init: function (req, res, next) {
        console.log('batteries.controller -> init()');
        next();
    },

    index: function (req, res, next) {
        Battery.find(function (err, data) {
            if (err) {
                return next(err);
            }

            res.json(data);
        });
    },

    get: function (req, res, next) {
        console.log(req.params.id);
        Battery.findById(req.params.id, function (err, data) {
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
                res.json(err);
            }

            res.json(data);
        });
    },

    destroy: function (req, res, next) {
        Battery.findByIdAndRemove(req.params.id, req.body, function (err, data) {
            if (err) {
                res.json(err);
            }

            res.json(data);
        });
    }
};