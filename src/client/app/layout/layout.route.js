(function () {
	'use strict';

	angular
		.module('app.layout')
		.config(configureRoutes);

	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('layout', {
                url: '',
				views: {
					'@': {
						templateUrl: 'app/layout/layout.html',
						controller: 'LayoutController',
						controllerAs: 'vm'
					},
					'header@layout': {
						templateUrl: 'app/layout/header.html',
						controller: 'HeaderController',
						controllerAs: 'vm'
					},
					'sidebar@layout': {
						templateUrl: 'app/layout/sidebar.html',
						controller: 'SidebarController',
						controllerAs: 'vm'
					},
					'container@layout': {
						template: '<div ui-view></div>',
					},
					'footer@layout': {
						templateUrl: 'app/layout/footer.html',
						// controller: 'FooterController',
						// controllerAs: 'vm'
					}
				},
            })
			.state('layout.home', {
				url: '/',
				views: {
					'container@layout': {
						templateUrl: 'app/home/home.html',
						controller: 'HomeController',
						controllerAs: 'vm'
					}
				}
			});
	}
} ());