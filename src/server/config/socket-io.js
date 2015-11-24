module.exports = function(app, settings) {
    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    // require('../sockets/chat-sockets.js', io);
    // require('../sockets/draw-sockets.js', io);
    var chat = io
        .of('/chat')
        .on('connection', function(socket) {

            socket.on('message', function(message) {
                chat.emit('message', message);
            });

            // socket.on('draw-update', function(coords) {
            //     // console.log('draw-update');
            //     socket.broadcast.emit('draw-update', coords);
            // });

        });

    http.listen(settings.websocketsPort, function() {
        console.log('Socket.io listening on *:' + settings.websocketsPort);
    });
};
