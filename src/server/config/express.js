var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport');
// var compress = require('compression');
// var cors = require('cors');

module.exports = function (app, config) {
    app.set('view engine', 'jade');
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(session({ secret: 'csa unicorns', resave: false, saveUninitialized: false }));
    app.use(passport.initialize());
    app.use(passport.session());
};