(function () {
	'use strict';

	angular
		.module('blocks.alert')
		.factory('alert', alert);

	alert.$inject = ['$rootScope', '$timeout'];
	function alert($rootScope, $timeout) {
		var service = {
			show: show
		};

		return service;

		////////////////
		var alertTimeout;

		function show(type, title, message, timeout) {
			$rootScope.alert = {
                hasBeenShow: true,
                show: true,
                type: type,
                message: message,
                title: title
            };

            $timeout.cancel(alertTimeout);

            alertTimeout = $timeout(function () {
                $rootScope.alert.show = false;
            }, timeout || 2000);
			
			console.log('message: ' + message);
		}
	}
})();