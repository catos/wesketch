var uuid = require('uuid');
var gameServer = require('./wesketch.server.js');

module.exports = function (io) {

    var weesketch = io
        .of('/weesketch')
        .on('connection', function (client) {

            gameServer.init(weesketch, function () {
                /**
                 * Client connected
                 */
                // console.log('\n\n*** wesketch.sockets.js -> connect -> socket.id = ' + client.id);
                client.emit('clientEvent', {
                    type: 'clientConnected',
                    value: client.id
                });

                /**
                 * Client disconnected
                 */
                client.on('disconnect', function () {
                    // console.log('\n\n*** wesketch.sockets.js -> disconnect -> socket.id = ' + client.id);
                    gameServer.diconnectClient(client.id);
                });

                /**
                 * Client events
                 */
                client.on('clientEvent', function (clientEvent) {
                    gameServer.onClientEvent(clientEvent);
                });
            });

        });

};
