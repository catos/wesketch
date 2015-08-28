module.exports = function (app, config) {

    var express = require('express'),
        routeHandler = require('../core/routeHandler')(config);

    // -- CLIENT --------------------------------------------------

    // Serve all files from client directory
    app.use(express.static('./src/client'));
    app.use('/bower_components', express.static('bower_components'));
    // app.use(express.static('./'));
    // app.use(express.static('./tmp'));

    // -- SERVER --------------------------------------------------
        
    // API Routes
    app.use('/api/batteries', routeHandler.getApiRouter('batteries'));

    // Server start page (index.jade)
    app.get('/api', function (req, res) {
        console.log('/api');
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