(function () {
	'use strict';

	angular
		.module('app.users')
		.factory('userService', userService);

	userService.$inject = ['$resource', 'config'];

	function userService($resource, config) {

        var userResource = $resource(config.serverPath + '/api/batteries/:id',
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

		userResource.prototype.isAdmin = function () {
			return this.roles && this.roles.indexOf('admin') > -1;
		};

		return userResource;
	}
})();