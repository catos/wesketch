var passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('../api/users/users.model.js');

module.exports = function () {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

	var strategyOptions = {
		usernameField: 'email'
	};

	var loginStrategy = new LocalStrategy(
		strategyOptions,
		function (email, password, done) {

			User.findOne({ email: email }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (!user) {
					return done(null, false, { message: 'Wrong email/password' });
				}

				user.comparePasswords(password, function (err, isMatch) {
					if (err) {
						return done(err);
					}

					if (!isMatch) {
						return done(null, false, { message: 'Wrong email/password' });
					}

					return done(null, user);
				});
			});
		});

    passport.use('local-login', loginStrategy);

}