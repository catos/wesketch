(function () {
    'use strict';

    angular
        .module('app', [
        // Angular modules
            'ngRoute',              // routing

            // Custom modules
            'app.core',

            // 3rd Party modules
            // 'ui.bootstrap'        // ui-bootstrap (ex: carousel, pagination, dialog)
		
        ]);

    angular
        .module('app')
        .config(['$routeProvider',
            function ($routeProvider) {
                $routeProvider.
                    when('/batteries', {
                        templateUrl: 'app/batteries/batteries.html',
                    })
                    .when('/batteries/:id', {
                        templateUrl: 'app/batteries/battery-detail.html',
                    })
                    .otherwise({
                        redirectTo: '/batteries'
                    });
            }]);
} ());