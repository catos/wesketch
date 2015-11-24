module.exports = function(io) {
    var chat = io
        .of('/chat')
        .on('connection', function(socket) {

            socket.on('message', function(message) {

                if (message.type !== 'draw') {
                    console.log(message);
                }

                chat.emit('message', message);
            });

            // socket.on('draw-update', function(coords) {
            //     // console.log('draw-update');
            //     socket.broadcast.emit('draw-update', coords);
            // });

        });
};
