(function () {
	'use strict';

	angular
		.module('app.batteries')
		.config(configureRoutes);		
	
	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('layout.batteries', {
				abstract: true,
                url: '/batteries',
				// views: {
            	// 	'container@layout': {
                		templateUrl: 'app/batteries/batteries.html',
						controller: 'BatteriesController',
						controllerAs: 'vm'
					// }
				// }				
            })
			.state('layout.batteries.list', {
				url: '',
				templateUrl: 'app/batteries/batteries-list.html',
                controller: 'BatteriesListController',
                controllerAs: 'vm',
				authenticate: true,
			})
			.state('layout.batteries.details', {
				url: '/:id',
				templateUrl: 'app/batteries/battery-details.html',
				controller: 'BatteryDetailsController',
				controllerAs: 'vm'
			});

	}
}());