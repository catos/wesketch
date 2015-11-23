module.exports = function(io) {

    var users = [];

    io.on('connection', function(socket) {

        socket.on('user-join', function(user) {
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

        socket.on('user-message', function(message) {
            ioEmit('user-message', message);
            // var received = Date.now();
            // message.latency = received - message.sent;
            // message.received = received;
            // io.emit('user-message', message);
        });

        socket.on('user-disconnect', function() {
            io.emit({
                message: 'User disconnected'
            });
            console.log('[ WS disconnect ] - User disconnected');
        });

    });

    function ioEmit(eventType, message) {
        var received = Date.now();
        message.latency = received - message.sent;
        message.received = received;
        io.emit(eventType, message);
        console.log('[ WS ' + eventType + ' ] - ' + message);
    }

};
