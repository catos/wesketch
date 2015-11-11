var User = require('./users.model');

module.exports = {
    init: function(req, res, next) {
        next();
    },

    index: function(req, res, next) {
        var filter = {};

        if (req.query.q !== undefined) {
            filter.firstName = new RegExp(req.query.q, 'i');
        }

        User
            .find(filter)
            .limit(10)
            .sort({
                number: -1
            })
            .exec(function callback(err, data) {
                if (err) {
                    return next(err);
                }
                res.json(data);
            });

    },

    get: function(req, res, next) {
        if (req.params.usersId !== '0') {
            User
                .findOne({
                    _id: req.params.usersId
                })
                .exec(function callback(err, data) {
                    if (err) {
                        return next(err);
                    }

                    res.json(data);
                });
        } else {
            res.json(new User());
        }
    },

    update: function(req, res, next) {
        User.findByIdAndUpdate(req.params.usersId, req.body, {
            new: true
        }, function(err, data) {
            if (err) {
                return next(err);
            }
            res.json(data);
        });
    },

    create: function(req, res, next) {
        User.create(req.body, function(err, data) {
            if (err) {
                return next(err);
            }

            res.json(data);
        });
    },

    destroy: function(req, res, next) {
        User.findByIdAndRemove(req.params.usersId, req.body, function(err, data) {
            if (err) {
                return next(err);
            }

            res.json(data);
        });
    }
};
