var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    passport = require('passport');

module.exports = function (app, config) {
    app.set('view engine', 'jade');
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(passport.initialize());

    app.use(function (req, res, next) {
        // TODO: magic string :3030
        res.header('Access-Control-Allow-Origin', 'http://localhost:3030');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');

        next();
    });
};