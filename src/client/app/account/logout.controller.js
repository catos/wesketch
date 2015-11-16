(function() {
'use strict';

	angular
		.module('app.account')
		.controller('LogoutController', LogoutController);

	LogoutController.$inject = ['$state', 'alert', 'tokenIdentity'];
	function LogoutController($state, alert, tokenIdentity) {
		alert.show('info', 'Snakkes!', 'Welcome back at later time yes');
		tokenIdentity.logout();
		$state.go('layout.home');
	}
})();
