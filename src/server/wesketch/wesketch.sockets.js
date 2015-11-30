var uuid = require('uuid');
var gameServer = require('./wesketch.server.js');

module.exports = function (io) {

    // TODO: wtb bedre navn enn weesketch her...
    var weesketch = io
        .of('/weesketch')
        .on('connection', function (socket) {

            /**
             * Player joined
             */
            console.log('\n\n*** wesketch.sockets.js -> connect -> socket.id = ' + socket.id);
            socket.emit('message', {
                type: 'client-connected',
                value: socket.id
            });

            /**
             * Player left
             */
            socket.on('disconnect', function () {
                console.log('\n\n*** wesketch.sockets.js -> disconnect -> socket.id = ' + socket.id);
                gameServer.diconnectClient(weesketch, socket.id);
            });

            /**
             * Game messages
             */
            socket.on('message', function (message) {
                gameServer.onMessage(weesketch, message);
            });
        });

};
