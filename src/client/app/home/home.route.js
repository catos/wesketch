(function () {
	'use strict';

	angular
		.module('app.home')
		.config(configureRoutes);

	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('layout.home', {
				url: '/',
				templateUrl: 'app/home/home.html',
				controller: 'HomeController',
				controllerAs: 'vm'
			});

	}
} ());