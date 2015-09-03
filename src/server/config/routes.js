var express = require('express'),
    passport = require('passport'),
    auth = require('./auth');

module.exports = function (app, config) {

    // -- CLIENT --------------------------------------------------

    // Serve all files from client directory
    app.use(express.static('./src/client'));
    
    // Server all files from bower_components
    app.use('/bower_components', express.static('bower_components'));


    // -- API Routes ----------------------------------------------
    
    require('../batteries/batteries.route.js')(app, config);

    require('../users/users.route.js')(app, config);

    
    // -- TEST --------------------------------------------------

    app.get('/open', function (req, res) {
        res.send('Welcome to the open route /open');
    });

    app.get('/authenticated', auth.requiresApiLogin,
        function (req, res) {
            res.send('Welcome to the /authenticated');
        }
    );
    
    app.get('/authorized', auth.requiresRole('admin'),
        function (req, res) {
            res.send('Welcome to /authorized, requires admin-role');
        }
    );
    
        
    // -- SERVER --------------------------------------------------

    app.post('/login', auth.authenticate);
    
    app.post('/logout', function (req, res) {
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