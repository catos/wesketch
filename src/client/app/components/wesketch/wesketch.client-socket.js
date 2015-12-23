(function() {
'use strict';

    angular
        .module('components.wesketch')
        .factory('wesketchClientSocket', wesketchClientSocket);

    wesketchClientSocket.$inject = ['sawkit'];
    function wesketchClientSocket(sawkit) {
        var service = {
            init: init,
            onServerEvent: onServerEvent,
            emit: emit
        };

        return service;

        ////////////////
        function init() {
            sawkit.connect('weesketch');
        }

        function onServerEvent(callback) {
            sawkit.on('serverEvent', callback);
        }

        function emit(player, type, value) {

            sawkit.emit('clientEvent', {
                player: player,
                type: type,
                value: value
            });

            if (type !== 'brush') {
                console.log(
                    '\n*** clientEmit:' +
                    ' player = ' + player.email + '(' + player.id + ')' +
                    ', type = ' + type +
                    ', value = ' + value);
            }
        }
    }
})();