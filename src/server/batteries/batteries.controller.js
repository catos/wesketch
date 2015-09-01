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
        // if (req.body.newCycle !== undefined) {
        //     var newCycle = req.body.newCycle;
        //     console.log(req.body.newCycle !== undefined);
        //     console.log("newCycle: " + newCycle, req.body.newCycle.length);
        // }
        // Battery.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, data) {
        //     if (err) {
        //         return next(err);
        //     }

        //     console.log('newCycle:', req.body.newCycle);

        //     if (req.body.newCycle !== undefined &&
        //         req.body.newCycle.length) {
        //         console.log('Add a cycles');
        //     }

        //     res.json(data);
        // });

        Battery.findById(req.params.id, function (err, battery) {
            console.log('req.body: ', req.body);
            if (err) {
                return next(err);
            }

            // if (req.body.newCycle !== undefined &&
            //     req.body.newCycle.length) {
            //     console.log('Add a cycles');

            //     // battery.cycles.push(req.body.newCycle);                
            // }
            
            // battery.cycles.push({
            //    created: '2015.01.01',
            //    comment: 'Bare en statisk kommentar lissm' 
            // });
            
            Battery.populate(battery, req.body.cycles, function (err, battery) {
                console.log("populate: " + battery);
            });

            battery.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });

            res.json(battery);
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