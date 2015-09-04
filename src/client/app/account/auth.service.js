(function () {
	'use strict';

	angular
		.module('app.account')
		.factory('accountService', accountService);

	accountService.$inject = ['$resource', 'config'];
	function accountService($resource, config) {

		return $resource(config.serverPath + '/server/login',
			{},
			{
				login: {
					method: 'POST'
				}
			}
			);		
		
		// var service = {
		// 	auth: auth,
		// 	logoutUser: logoutUser,
		// 	authorizeCurrentUserForRoute: authorizeCurrentUserForRoute,
		// 	authorizeAuthenticationForRoute: authorizeAuthenticationForRoute
		// };
		
		// return service;

		// function auth(username, password) {
		// 	console.log('auth'); 
		// 	return $resource(config.serverPath + '/server/login',
		// 		{ 
		// 			username: username,
		// 			password: password
		// 		},
		// 		{
		// 			login: {
		// 				method: 'POST'
		// 			}
		// 		}
		// 	);
		// }
		
		// function logoutUser() {
			
		// }
		
		// function authorizeCurrentUserForRoute() {
			
		// }
		
		// function authorizeAuthenticationForRoute() {
			
		// }
	}
})();