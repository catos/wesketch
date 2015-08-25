(function () {
    'use strict';

    angular
        .module('app.batteries')
        .factory('batteriesService', batteriesService);

    batteriesService.$inject = ['$resource', 'config'];

    function batteriesService($resource, config) {
        return $resource(
            config.serverPath + '/api/batteries/:id',
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