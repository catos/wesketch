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
                client.emit('message', {
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
                 * Game messages
                 */
                client.on('message', function (message) {
                    gameServer.onMessage(message);
                });
            });

        });

};