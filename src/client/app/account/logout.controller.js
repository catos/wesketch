(function() {
'use strict';

	angular
		.module('app.account')
		.controller('LogoutController', LogoutController);

	LogoutController.$inject = ['$auth', '$state'];
	function LogoutController($auth, $state) {
		$auth.logout();
		$state.go('layout.home');
	}
})();