(function () {
    'use strict';

    angular
        .module('app')
        .config(config)
        .run(run);

    config.$inject = ['$authProvider', '$urlRouterProvider', 'appConfig'];

    function config($authProvider, $urlRouterProvider, appConfig) {
        $urlRouterProvider.otherwise('/');

        $authProvider.loginUrl = appConfig.apiUrl + 'login';
        $authProvider.signupUrl = appConfig.apiUrl + 'register';
        $authProvider.tokenPrefix = appConfig.applicationPrefix;
    }

    run.$inject = ['$rootScope', '$state', '$auth', 'alert', 'tokenIdentity'];

    function run($rootScope, $state, $auth, alert, tokenIdentity) {
        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {

                if (toState.restricted) {

                    if (toState.restricted.requiresLogin && !tokenIdentity.isAuthenticated()) {
                        $state.transitionTo('layout.account.login');
                        event.preventDefault();
                    }

                    if (toState.restricted.requiresAdmin && !tokenIdentity.isAdmin()) {
                        alert.show(
                            'info',
                            'Restricted area',
                            'You do not have sufficient permissions to enter this area');
                        $state.go('layout.home');
                        event.preventDefault();
                    }

                }

            });
    }
})();
