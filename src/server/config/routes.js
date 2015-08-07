(function () {
    'use strict';

    var express = require('express'),
        batteriesRouter = require('../batteries/batteries.routes.js');

    module.exports = function (app, config) {

        app.all('*', function(req, res, next) {
            console.log(req.path);
            next();
        })

        // -- CLIENT --------------------------------------------------

        // Serve all files from client directory
        app.use(express.static('src/client'));
        
        // Any deep link calls should return index.html
        // app.use('/*', express.static('./src/client/index.html'));
        
        // -- SERVER --------------------------------------------------
        
        // Serverside controller
        app.use('/api/batteries', batteriesRouter);

        // Server start page (index.jade)
        app.get('/api', function (req, res) {
            res.render(config.rootPath + 'server/views/index');
        });

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
} ());