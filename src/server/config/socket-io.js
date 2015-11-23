module.exports = function (app, settings) {
    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    // require('../sockets/chat-sockets.js', io);
    // require('../sockets/draw-sockets.js', io);
    io.on('connection', function(socket) {

        socket.on('draw-update', function(coords) {
            // console.log('draw-update');
            socket.broadcast.emit('draw-update', coords);
        });

        socket.on('draw-message', function(message) {
            console.log('draw-message');
            socket.broadcast.emit('draw-message', message);
        });
    });

    http.listen(settings.websocketsPort, function () {
        console.log('Socket.io listening on *:' + settings.websocketsPort);
    });

};
