(function () {
    'use strict';

    angular
        .module('app')
        .factory('batteriesService', batteriesService);

    batteriesService.$inject = ['$resource', 'appSettings'];

    function batteriesService($resource, appSettings) {
        console.log(appSettings.serverPath);
        var result = $resource(
            appSettings.serverPath + '/api/batteries/:id',
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
        return result;
    }
	
} ());