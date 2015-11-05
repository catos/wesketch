(function () {
	'use strict';

	angular
		.module('app.account')
		.config(configureRoutes);		
	
	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('layout.account', {
				abstract: true,
                url: '/account',
				templateUrl: 'app/account/account.html',
				// controller: 'AccountController',
				// controllerAs: 'vm'
            })
			.state('layout.account.login', {
				url: '/login',
				templateUrl: 'app/account/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
			})
			.state('layout.account.logout', {
				url: '/logout',
                controller: 'LogoutController',
			});
	}
}());