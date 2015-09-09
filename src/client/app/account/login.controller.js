(function () {
	'use strict';

	angular
		.module('app.account')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['$state', 'accountIdentity', 'accountService'];
	
	function LoginController($state, accountIdentity, accountService) {
		var vm = this;
		vm.message = '';
		vm.identity = accountIdentity;
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
						$state.go('layout');
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