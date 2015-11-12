(function () {
	'use strict';

	angular
		.module('app.chat')
		.config(configureRoutes);

	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('layout.chat', {
                url: '/chat',
				templateUrl: 'app/chat/chat.html',
				controller: 'ChatController',
				controllerAs: 'vm'
			});
	}
} ());