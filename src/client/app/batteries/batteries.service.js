(function () {
    'use strict';

    angular
        .module('app.batteries')
        .factory('batteriesService', batteriesService);

    batteriesService.$inject = ['$resource', 'appConfig'];

    function batteriesService($resource, appConfig) {
        return $resource(appConfig.apiUrl + 'api/batteries/:id',
            { id: '@id' },
            {
                'get': {
                    method: 'GET'
                },
                'save': {
                    method: 'POST'
                },
                'update': {
                    method: 'PUT'
                },
                'delete': {
                    method: 'DELETE'
                }
            });
    }

} ());