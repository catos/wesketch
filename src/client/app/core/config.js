(function () {
    'use strict';

    var core = angular.module('app.core');
    // .constant('appSettings', {
    //     serverPath: 'http://localhost:3030'
    // });


    var config = {
        serverPath: 'http://localhost:3030'
    }

    core.value('config', config);

    core.config(configure);
    configure.$inject = ['$logProvider']; //, 'exceptionHandlerProvider'];
    /* @ngInject */
    function configure($logProvider) { //, exceptionHandlerProvider) {
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        // exceptionHandlerProvider.configure(config.appErrorPrefix);
    }
} ());