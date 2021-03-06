var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    passport = require('passport'),
    cors = require('cors');

module.exports = function (app) {
    app.set('view engine', 'jade');
    // app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());
    app.use(passport.initialize());
};