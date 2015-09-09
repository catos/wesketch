var express = require('express'),
    passport = require('passport'),
    auth = require('./auth');

module.exports = function (app, config) {

    // -- CLIENT --------------------------------------------------

    app.use(function (req, res, next) {

        if (req.user) {
            console.log('req.user: ', req.user.firstName);
            res.lol = req.user;
            console.log('res.lol', res.lol.firstName);
        }
        next();
    });

    // Serve all files from client directory
    app.use(express.static('./src/client'));
    
    // Server all files from bower_components
    app.use('/bower_components', express.static('bower_components'));


    // -- API Routes ----------------------------------------------
    
    require('../batteries/batteries.route.js')(app, config);

    require('../users/users.route.js')(app, config);

    // -- SERVER --------------------------------------------------

    app.post('/server/login', auth.authenticate);

    app.post('/server/logout', function (req, res) {
        req.logout();
        res.end();
    });

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