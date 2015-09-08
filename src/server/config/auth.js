var passport = require('passport');

module.exports = {    
    authenticate: function(req, res, next) {
        console.log('users.controller.js->authenticate');
        var auth = passport.authenticate('local', function(err, user) {
            if (err) {
                return next(err);
            }
    
            if (!user) {
                res.send({success: false});
            }
    
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
    
                res.send({success: true, user: user});
            })
        });
        auth(req, res, next);
    },
    requiresApiLogin: function(req, res, next) {
        console.log('users.controller.js->requiresApiLogin');
        if (!req.isAuthenticated()) {
            res.status(403);
            res.end();
        } else {
            next();
        }
    },
    requiresRole: function(role) {
        console.log('users.controller.js->requiresRole');
        return function(req, res, next) {
            if (!req.isAuthenticated() ||
                req.user.roles.indexOf(role) === -1) {
                res.status(403);
                res.end();
            } else {
                next();
            }
        }
    }
};