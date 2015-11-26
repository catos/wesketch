var uid = require('uid');
var server = require('./wesketch.server.js');

module.exports = function (io) {

    var weesketch = io
        .of('/weesketch')
        .on('connection', function (client) {
            
            /**
             * Player joined
             */
            client.id = uid(10);
            weesketch.emit('message', {
                type: 'client-connected',
                value: client.id
            });
            console.log('client connected, id = ' + client.id);
            
            /**
             * Player left
             */
            client.on('disconnect', function () {
                console.log('client disconnected, id = ' + client.id);
            });

            /**
             * Game messages
             */
            client.on('message', function (message) {
                // TODO: move this to the server
                server.validateClientMessage(message, function (err, message) {
                    
                    if (err) {
                        weesketch.emit('message', {
                            type: 'error',
                            value: err.message
                        });
                        return;
                    }
                    
                    switch (message.type) {
                        case 'brush': {
                            break;
                        }
                        case 'player-joined': {
                            message.value = server.addPlayer(message.value);
                            break;
                        }
                        default: {
                            console.log(message);
                        }
                    }

                    weesketch.emit('message', message);
                });

            });
           
        });

};
