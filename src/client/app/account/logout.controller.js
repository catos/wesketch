(function() {
'use strict';

	angular
		.module('app.account')
		.controller('LogoutController', LogoutController);

	LogoutController.$inject = ['$state', 'identity'];
	function LogoutController($state, identity) {
		identity.logout();
		$state.go('layout.home');		
	}
})();