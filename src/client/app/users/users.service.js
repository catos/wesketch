(function () {
    'use strict';

    angular
        .module('app.users')
        .factory('UsersService', UsersService);

    UsersService.$inject = ['$resource', 'appSettings'];

    function UsersService($resource, appSettings) {
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