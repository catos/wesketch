(function () {
	'use strict';

	angular
		.module('app.batteries')
		.config(configureRoutes);		
	
	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('batteries', {
				abstract: true,
                url: '/batteries',
                templateUrl: 'app/batteries/batteries.html'
            })
			.state('batteries.list', {
				url: '',
				templateUrl: 'app/batteries/batteries-list.html',
                controller: 'BatteriesController',
                controllerAs: 'vm'
			})
			.state('batteries.details', {
				url: '/:id',
				templateUrl: 'app/batteries/battery-details.html',
				controller: 'BatteryDetailsController',
				controllerAs: 'vm'
			});

	}
}());