(function () {
	'use strict';

	angular
		.module('app.account')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['accountService'];
	
	function LoginController(accountService) {
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
			
			accountService.login(
				{ 
					username: username, 
					password: password
				},
				function (data) {
					console.log('data: ', data);
					if (!data.success) {
						vm.message = 'Wrong username or password.';
					}
				}
			);
		}
		
		function logout() {
			console.log('Logout...');
		}
	}
})();