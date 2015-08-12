var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan');
// stylus = require('stylus'),
// cookieParser = require('cookie-parser'),
// session = require('express-session'),
// passport = require('passport');
// var compress = require('compression');
// var cors = require('cors');

module.exports = function (app, config) {
    // function compile(str, path) {
    //     return stylus(str).set('filename', path);
    // }

    // app.set('views', config.rootPath + '/server/views');
    app.set('view engine', 'jade');
    app.use(morgan('dev'));
    // app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    // app.use(session({secret: 'multi vision unicorns'}));
    // app.use(passport.initialize());
    // app.use(passport.session());
    // app.use(stylus.middleware(
    //     {
    //         src: config.rootPath + '/client',
    //         compile: compile
    //     }
    // ));
    // app.use(express.static(config.rootPath + '/client'));
    
};
