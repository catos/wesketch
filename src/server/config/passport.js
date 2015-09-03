var passport = require('passport'),
    mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../users/users.model');

module.exports = function() {
	
    passport.use(new LocalStrategy(
        function(username, password, done) {
            console.log('passport.js->use');
            User.findOne({username:username}).exec(function(err, user) {                
                if (err) { 
                    console.log('Error');
                    return done(err); 
                }
                
                if (!user) {
                    console.log('User not found');
                    return done(null, false, { message: 'User not found.' });
                }
                
                if (!user.authenticate(password)) {
                    console.log('Incorrect password');
                    return done(null, false, { message: 'Incorrect password.' });
                }
                
                return done(null, user);                
            })
        }
    ));

    passport.serializeUser(function(user, done) {
        console.log('passport.js->serializeUser');
        if (user) {
            done(null, user._id);
        }
    });

    passport.deserializeUser(function(id, done) {
        console.log('passport.js->deserializeUser');
        User.findOne({_id:id}).exec(function(err, user) {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
    });

};