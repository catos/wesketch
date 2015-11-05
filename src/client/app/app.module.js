/// <reference path="../../../typings/angularjs/angular.d.ts"/>
(function () {
    'use strict';

    angular
        .module('app', [
            'ngResource',
            'satellizer',
            
            'blocks.logger',
            'blocks.alert', 
            
            'ui.router',
            'ui.bootstrap', 
            
            'app.layout',
            'app.home',
            'app.batteries',
            'app.account'
        ]);
        
} ());