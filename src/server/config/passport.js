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

			var searchUser = {
				email: email
			};

			User.findOne(searchUser, function (err, user) {
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

	var registerStrategy = new LocalStrategy(strategyOptions, function (email, password, done) {

		var searchUser = {
			email: email
		};

		User.findOne(searchUser, function (err, user) {
			if (err) {
				return done(err);
			}

			if (user) {
				return done(null, false, { message: 'Email already exists' });
			}

			var newUser = new User({
				email: email,
				password: password
			});

			newUser.save(function (err) {
				if (err) {
					console.log('err: ' + err);
				}

				done(null, newUser);
			});
		});

	});

    passport.use('local-register', registerStrategy);
    passport.use('local-login', loginStrategy);

}