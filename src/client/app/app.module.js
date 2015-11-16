/// <reference path="../../../typings/angularjs/angular.d.ts"/>
(function () {
    'use strict';

    angular
        .module('app', [
            'ngResource',
            'satellizer',

            'blocks.alert',
            'blocks.sawkit',
            'blocks.tokenIdentity',

            'ui.router',
            'ui.bootstrap',

            'app.layout',
            'app.home',
            'app.account',

            'app.users',
            'app.chat',
            'app.draw',
            'app.batteries',
        ]);

} ());
