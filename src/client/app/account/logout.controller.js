(function() {
'use strict';

	angular
		.module('app.account')
		.controller('LogoutController', LogoutController);

	LogoutController.$inject = ['$state', 'alert', 'identity'];
	function LogoutController($state, alert, identity) {
		alert.show('info', 'Snakkes!', 'Welcome back at later time yes');
		identity.logout();
		$state.go('layout.home');		
	}
})();