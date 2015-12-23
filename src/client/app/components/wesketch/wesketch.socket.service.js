(function () {
    'use strict';

    angular
        .module('components.wesketch')
        .service('WesketchSocketService', WesketchSocketService);

    WesketchSocketService.$inject = ['sawkit'];
    function WesketchSocketService(sawkit) {
        this.init = init;
        this.onServerEvent = onServerEvent;
        this.emit = emit;

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