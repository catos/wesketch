(function () {
	'use strict';

	angular
		.module('app.account')
		.config(configureRoutes);		
	
	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('account', {
				abstract: true,
                url: '/account'
            })
			.state('account.login', {
				url: '',
				templateUrl: 'app/account/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
			});
	}
}());