module.exports = function(io) {
    io.on('connection', function(socket) {

        socket.on('draw-update', function(coords) {
            console.log('draw-update');
            socket.broadcast.emit('draw-update', coords);
        });

        socket.on('draw-message', function(message) {
            console.log('draw-message');
            socket.broadcast.emit('draw-message', message);
        });
    });
};
