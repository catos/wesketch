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
};