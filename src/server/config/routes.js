var express = require('express');
var passport = require('passport');
var jwt = require('jwt-simple');
var moment = require('moment');
var User = require('../api/users/users.model.js');

var batteryRoutes = require('../api/batteries/batteries.route.js');
var userRoutes = require('../api/users/users.route.js');

module.exports = function (app, settings, environment) {

    // -- API ----------------------------------------------

    batteryRoutes(app, settings);
    userRoutes(app, settings);

    // -- PASSPORT ---------------------------------

    app.post('/register', function (req, res) {
        User.findOne({ email: req.body.email }, function (err, user) {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (user) {
                res.status(500).send({ message: 'Email already exists' });
                return;
            }

            var newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            newUser.save(function (err) {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                createSendToken(newUser, res);
            });
        });
    });

    app.post('/login', passport.authenticate('local-login'), function (req, res) {
        createSendToken(req.user, res);
    });

    function createSendToken(user, res) {
        var payload = {
            sub: user.id,
            exp: moment().add(10, 'days').unix(),
            user: {
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin
            }
        };

        var token = jwt.encode(payload, 'shhh..');

        res.status(200).send({
            user: user.toJSON(),
            token: token
        });
    }

    // -- SERVER --------------------------------------------------

    // Server start page (index.jade)
    app.get('/server', function (req, res) {
        res.render(settings.rootPath + 'server/views/index');
    });

    // -- CLIENT --------------------------------------------------

    switch (environment) {
        case 'development': {
            console.log('** DEVELOPMENT **');
            app.use('/', express.static('./src/client/'));
            app.use('/', express.static('./'));
            break;
        }
        case 'production': {
            console.log('** PRODUCTION **');
            // app.use('/', express.static('./build/stage/'));
            app.use('/', express.static('./build/'));
            break;
        }
    }

    // 404
    app.use(function fourOfour(req, res, next) {
        res.status(404);

        var response = {
            message: 'Sorry, an error has occured, Requested resource not found!',
        };

        if (req.accepts('html')) {
            res.render(settings.rootPath + 'server/views/404', response);
            return;
        }

        if (req.accepts('json')) {
            res.json(response);
            return;
        }

        res.send('Not Found').end();
    });


};