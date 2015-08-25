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
    configure.$inject = ['$logProvider', 'routerHelperProvider']; //, 'exceptionHandlerProvider'];
    /* @ngInject */
    function configure($logProvider, routerHelperProvider) { //, exceptionHandlerProvider) {
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        // exceptionHandlerProvider.configure(config.appErrorPrefix);
        routerHelperProvider.configure({ docTitle: config.appTitle + ': ' });
    }
} ());