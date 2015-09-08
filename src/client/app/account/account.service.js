(function () {
	'use strict';

	angular
		.module('app.account')
		.factory('accountService', accountService);

	accountService.$inject = ['$http', '$q', 'config'];

	function accountService($http, $q, config) {

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
                    // var user = new mvUser();
                    // angular.extend(user, response.data.user);
                    // mvIdentity.currentUser = user;
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