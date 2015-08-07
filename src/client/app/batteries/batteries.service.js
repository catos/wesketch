(function () {
    'use strict';

    angular
        .module('app')
        .factory('batteriesService', batteriesService);

    batteriesService.$inject = ['$resource', 'appSettings'];

	function batteriesService($resource, appSettings) {
        console.log(appSettings.serverPath);
        return $resource(
            appSettings.serverPath + '/api/batteries/:id',
            null,
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
	
    // function batteryService($resource, appSettings, currentUser) {
    //     return $resource(
    //         appSettings.serverPath + '/api/products/:id',
    //         null,
    //         {
    //             'get': {
    //                 headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }
    //             },
    //             'save': {
    //                 headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }
    //             },
    //             'update': {
    //                 method: 'PUT',
    //                 headers: { 'Authorization': 'Bearer ' + currentUser.getProfile().token }
    //         }
    //         });
    // }

} ());