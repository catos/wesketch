(function () {
	'use strict';

	angular
		.module('app.account')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['$state', 'accountService'];
	
	function LoginController($state, accountService) {
		var vm = this;
		vm.message = '';
		vm.identity = {};
		vm.login = login;
		vm.logout = logout;

		activate();

		function activate() {

		}
		
		function login(username, password) {
			vm.message = '';
			
			accountService
				.login(username, password)
				.then(function(success) {
					if (success) {
						vm.message = 'Yay!';
					} else {
						vm.message = 'Wrong username and/or password.';
					}
				});
		}
		
		// $scope.signout = function() {
		// 	mvAuth.logoutUser().then(function() {
		// 		$scope.username = "";
		// 		$scope.password = "";
		// 		mvNotifier.notify("You have successfully signed out!");
		// 		$location.path("/");
	
		// 	})
		// }		
		function logout() {
			console.log('Logout...');
		}
	}
})();