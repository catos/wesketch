(function () {
	'use strict';

	angular
		.module('app.users')
		.config(configureRoutes);

	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('layout.users', {
				abstract: true,
                url: '/users',
				templateUrl: 'app/users/users.html',
			})
			.state('layout.users.list', {
				url: '',
				templateUrl: 'app/users/users-list.html',
                controller: 'UsersListController',
                controllerAs: 'vm',
				authenticate: true,
			})
			.state('layout.users.details', {
				url: '/:id',
				templateUrl: 'app/users/user-details.html',
                controller: 'UserDetailsController',
                controllerAs: 'vm',
				authenticate: true,
			});

	}
} ());