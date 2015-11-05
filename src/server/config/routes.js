var express = require('express'),
    passport = require('passport'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    User = require('../api/users/users.model.js');

module.exports = function (app, config) {

    // -- CLIENT --------------------------------------------------

    // Serve all files from client directory
    app.use(express.static('./src/client'));
    
    // Server all files from bower_components
    app.use('/bower_components', express.static('bower_components'));


    // -- API ----------------------------------------------
    
    require('../api/batteries/batteries.route.js')(app, config);

    require('../api/users/users.route.js')(app, config);

    // -- PASSPORT ---------------------------------


    app.post('/register', passport.authenticate('local-register'), function (req, res) {
        createSendToken(req.user, res);
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
                name: 'Lol we need to set this',
                roles: ['admin', 'special', 'lol']
            }
        }

        var token = jwt.encode(payload, 'shhh..');

        res.status(200).send({
            user: user.toJSON(),
            token: token
        });
    }
    
    // -- SERVER --------------------------------------------------

    // Server start page (index.jade)
    app.get('/server', function (req, res) {
        res.render(config.rootPath + 'server/views/index');
    });
    
    // Any deep link calls should return index.html
    app.use('/*', express.static('./src/client/index.html'));

    // 404
    app.use(function fourOfour(req, res, next) {
        res.status(404);

        var response = {
            message: 'Sorry, an error has occured, Requested resource not found!',
        };

        if (req.accepts('html')) {
            res.render(config.rootPath + 'server/views/404', response);
            return;
        }

        if (req.accepts('json')) {
            res.json(response);
            return;
        }

        res.send('Not Found').end();
    });


};