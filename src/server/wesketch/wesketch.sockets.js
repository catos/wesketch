var server = require('./wesketch.server.js');

module.exports = function (io) {

    var chat = io
        .of('/chat')
        .on('connection', function (socket) {

            socket.on('message', function (message) {
                server.validateClientMessage(message, function (err, message) {
                    
                    if (err) {
                        chat.emit('message', {
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

                    chat.emit('message', message);
                });

            });
        });



};
