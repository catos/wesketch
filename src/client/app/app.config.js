(function () {
	'use strict';

	var appSettings = {
		ApplicationName: 'Cato Skogholt Application',
		ApplicationPrefix: 'CSA',
		ApiUrl: 'http://localhost:3000/'
	};

	angular
		.module('app')
		.constant('appSettings', appSettings)
		.config(config)
		.run(run);

	config.$inject = ['$authProvider', '$urlRouterProvider', 'appSettings'];
	function config($authProvider, $urlRouterProvider, appSettings) {
		$urlRouterProvider.otherwise('/');

		$authProvider.loginUrl = appSettings.ApiUrl + 'login';
		$authProvider.signupUrl = appSettings.ApiUrl + 'register';
		$authProvider.tokenPrefix = appSettings.ApplicationPrefix;
	}

	run.$inject = ['$rootScope', '$state', '$auth'];
	function run($rootScope, $state, $auth) {
		$rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
			if (toState.authenticate && !$auth.isAuthenticated()) {
				$state.transitionTo("layout.account.login");
				event.preventDefault();
			}
		});
	}
})();