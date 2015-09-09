(function () {
	'use strict';

	angular
		.module('app.account')
		.factory('accountService', accountService);

	accountService.$inject = ['$http', '$q', 'accountIdentity', 'config', 'usersService'];

	function accountService($http, $q, accountIdentity, config, usersService) {

		var service = {
			login: login,
			logout: logout,
			authorizeCurrentUserForRoute: authorizeCurrentUserForRoute,
			authorizeAuthenticationForRoute: authorizeAuthenticationForRoute
		};

		return service;

		function login(username, password) {
			console.log('Login');
			
			var dfd = $q.defer();

			$http.post('/server/login', { username: username, password: password }).then(function (response) {
				console.log('response.data: ', response.data);
                if (response.data.success) {
                    var user = new usersService();
					console.log('user 1: ', user);
                    angular.extend(user, response.data.user);
					console.log('user 2: ', user);
                    accountIdentity.currentUser = user;
					console.log('accountIdentity.currentUser: ', accountIdentity.currentUser);
                    dfd.resolve(true);
                } else {
                    dfd.resolve(false);
                }
			});
			
			return dfd.promise;
		}

		function logout() {
			console.log('Logout');
		}

		function authorizeCurrentUserForRoute() {

		}

		function authorizeAuthenticationForRoute() {

		}

	}
})();