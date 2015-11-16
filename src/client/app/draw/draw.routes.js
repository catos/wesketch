(function () {
	'use strict';

	angular
		.module('app.draw')
		.config(configureRoutes);

	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('layout.draw', {
                url: '/draw',
				templateUrl: 'app/draw/draw.html',
				controller: 'DrawController',
				controllerAs: 'vm',
                restricted: {
					requiresLogin: true
				}
			});
	}
} ());
