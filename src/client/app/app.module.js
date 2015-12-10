/// <reference path="../../../typings/angularjs/angular.d.ts"/>
(function () {
    'use strict';

    angular
        .module('app', [

        /* Shared modules */
            'app.core',

            'components.wesketch',

            'ui.router',
            'ui.bootstrap',

        /* Feature areas */
            'app.layout',
            'app.home',
            'app.account',

            'app.users',
            'app.chat',
            'app.draw',
            'app.batteries',
        ]);

} ());
