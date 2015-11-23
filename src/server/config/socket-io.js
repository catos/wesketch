module.exports = function (app, settings) {
    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    var users = [];

    io.on('connection', function (socket) {

        /**
         * Chat
         */
        socket.on('user-join', function (user) {
            var userAlreadyExist = false;
            for (var i = 0; i < users.length; i++) {
                if (users[i].name === user.name) {
                    userAlreadyExist = true;
                }
            }

            if (!userAlreadyExist) {
                users.push(user);
            }
            io.emit('user-join', users);
        });

        socket.on('user-message', function (message) {
            ioEmit('user-message', message);
            // var received = Date.now();
            // message.latency = received - message.sent;
            // message.received = received;
            // io.emit('user-message', message);
        });

        socket.on('user-disconnect', function () {
            io.emit({
                message: 'User disconnected'
            });
            console.log('[ WS disconnect ] - User disconnected');
        });
    });

    io.on('connection', function (socket) {

        /**
         * Draw
         */
        socket.on('draw-update', function (coords) {
            //  console.log('draw-update');
            socket.broadcast.emit('draw-update', coords);
        });

        socket.on('draw-message', function (message) {
            //  console.log('draw-message');
            socket.broadcast.emit('draw-message', message);
        });
    });

    http.listen(settings.websocketsPort, function () {
        console.log('Socket.io listening on *:' + settings.websocketsPort);
    });

    function ioEmit(eventType, message) {
        var received = Date.now();
        message.latency = received - message.sent;
        message.received = received;
        io.emit(eventType, message);
        console.log('[ WS ' + eventType + ' ] - ' + message);
    };
};
