/// <reference path="../../../typings/angularjs/angular.d.ts"/>
(function () {
    'use strict';

    angular
        .module('app', [
            'app.core',
            
        // 'app.widgets',

            'app.layout',
            'app.home',
            'app.batteries',
            'app.recipes',
            'app.account',
            'app.users'            
        ]);
        
        
    // TODO: flytt i egne filer...
    var app = angular.module('app');

    app.config(['$stateProvider', '$urlRouterProvider', configRoutes]);

    function configRoutes($stateProvider, $urlRouterProvider) {
        
        $urlRouterProvider.otherwise('/');
        
    }

    app.run(['$state', function ($state) {

    }]);

} ());