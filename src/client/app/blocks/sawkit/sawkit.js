/* global io */
(function () {
        'use strict';

	angular
		.module('blocks.sawkit')
		.factory('sawkit', sawkit);

	sawkit.$inject = ['$rootScope', 'appConfig'];
	function sawkit($rootScope, appConfig) {

		var socket;

		var service = {
            connect: connect,
			on: on,
			emit: emit
		};

        return service;

        function connect(room) {
             socket = io.connect(appConfig.socketUrl + room);
             console.log('sawkit is connecting to room: ' + room);
        }

        function on(eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        }

        function emit(eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }

	}
})();
