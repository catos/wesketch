(function() {
    'use strict';

    var appSettings = {
        ApplicationName: 'Cato Skogholt Application',
        ApplicationPrefix: 'CSA',
        ApiUrl: 'http://localhost:7203/'
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

    run.$inject = ['$rootScope', '$state', '$auth', 'alert', 'identity'];

    function run($rootScope, $state, $auth, alert, identity) {
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                
                if (toState.restricted) {
                    
                    if (toState.restricted.requiresLogin && !identity.isAuthenticated())
                    {
                        $state.transitionTo('layout.account.login');
                        event.preventDefault();
                    }
                    
                    if (toState.restricted.requiresAdmin && !identity.isAdmin())
                    {
                        alert.show('info', 'Restricted area', 'You do not have sufficient permissions to enter this area');
                        $state.go('layout.home');
                        event.preventDefault();
                    }
                    
                }

            });
    }
})();
