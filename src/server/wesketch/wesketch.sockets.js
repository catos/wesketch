var uuid = require('uuid');
var gameServer = require('./wesketch.server.js');

module.exports = function (io) {

    var weesketch = io
        .of('/weesketch')
        .on('connection', function (socket) {
            
            /**
             * Player joined
             */
            socket.clientId = uuid.v4();
            console.log('client connected, clientId = ' + socket.clientId);
            weesketch.emit('message', {
                type: 'client-connected',
                value: socket.clientId
            });
            
            /**
             * Player left
             */
            // socket.on('disconnect', function () {
            //     console.log('client disconnected, id = ' + socket.clientId);
            //     weesketch.emit('message', {
            //         type: 'client-disconnect',
            //         value: socket.clientId
            //     });
            // });

            /**
             * Game messages
             */
            socket.on('message', function (message) {
                // TODO: move this to the server 
                gameServer.onMessage(weesketch, message);

            });
           
        });

};
