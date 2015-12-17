var uuid = require('uuid');
var server = require('./wesketch.server.js');

module.exports = function (io) {
    var weesketch = io
        .of('/weesketch')
        .on('connection', function (client) {
            server.init(weesketch, function () {

                /**
                 * Client disconnected
                 */
                client.on('disconnect', function () {
                    server.onClientDisconnected(client.id);
                });

                /**
                 * Client events
                 */
                client.on('clientEvent', function (clientEvent) {
                    clientEvent.clientId = client.id;
                    server.onClientEvent(clientEvent);
                });

            });

        });

};
