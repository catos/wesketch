var uuid = require('uuid');
var server = require('./wesketch.server.js');

module.exports = function (io) {

    var weesketch = io
        .of('/weesketch')
        .on('connection', function (client) {

            server.init(weesketch, function () {
                /**
                 * Client connected
                 */
                // console.log('\n\n*** wesketch.sockets.js -> connect -> socket.id = ' + client.id);
                server.connectClient(client.id);

                /**
                 * Client disconnected
                 */
                client.on('disconnect', function () {
                    // console.log('\n\n*** wesketch.sockets.js -> disconnect -> socket.id = ' + client.id);
                    server.diconnectClient(client.id);
                });

                /**
                 * Client events
                 */
                client.on('clientEvent', function (clientEvent) {
                    server.onClientEvent(clientEvent);
                });
            });

        });

};
