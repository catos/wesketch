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
			.state('layout.users.edit', {
				url: '/:id/edit',
				templateUrl: 'app/users/user-edit.html',
                controller: 'UserEditController',
                controllerAs: 'vm',
				authenticate: true,
			})
			.state('layout.users.create', {
				url: '/create',
				templateUrl: 'app/users/user-create.html',
                controller: 'UserCreateController',
                controllerAs: 'vm',
				authenticate: true,
			});

	}
} ());