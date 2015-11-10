/// <reference path="../../../typings/angularjs/angular.d.ts"/>
(function () {
    'use strict';

    angular
        .module('app', [
            'ngResource',
            'satellizer',
            
            'blocks.alert', 
            
            'ui.router',
            'ui.bootstrap', 
            
            'app.layout',
            'app.home',
            'app.account',

            'app.users',
            'app.batteries'
        ]);
        
} ());