/* global io */
(function () {
	'use strict';

	angular
		.module('blocks.sawkit')
		.factory('sawkit', sawkit);

	sawkit.$inject = ['$rootScope', 'appSettings'];
	function sawkit($rootScope, appSettings) {

		var socket = io.connect(appSettings.SocketUrl);
		return {
			on: function (eventName, callback) {
				socket.on(eventName, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						callback.apply(socket, args);
					});
				});
			},
			emit: function (eventName, data, callback) {
				socket.emit(eventName, data, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				});
			}
		};

	}
})();