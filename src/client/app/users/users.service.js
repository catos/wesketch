(function () {
    'use strict';

    angular
        .module('app.users')
        .factory('usersService', usersService);

    usersService.$inject = ['$resource', 'appSettings'];

    function usersService($resource, appSettings) {
        return $resource(appSettings.ApiUrl + 'api/users/:id',
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