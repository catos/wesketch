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
        if (req.params.id !== '0') {
            Battery
                .findOne({ '_id': req.params.id })
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
        var newCycle = req.body.newCycle;
        console.log("newCycle: " + newCycle, req.body.newCycle.length);
        // Battery.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, data) {
        //     if (err) {
        //         return next(err);
        //     }
            
        //     console.log(this);

        //     res.json(data);
        // });
        Battery.findById(req.params.id, function (err, doc) {
            if (err) {
                return next(err);
            }

            doc.cycles.push(newCycle);

            doc.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });

            res.json(doc);
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