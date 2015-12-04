// module.exports = function(app, settings) {
//     var http = require('http').Server(app);
//     var io = require('socket.io')(http);

//     // require('../sockets/chat-sockets.js', io);
//     require('../wesketch/wesketch.sockets.js')(io);

//     http.listen(settings.websocketsPort, function() {
//         console.log('Socket.io listening on *:' + settings.websocketsPort);
//     });
// };


module.exports = function(io) {
    require('../wesketch/wesketch.sockets.js')(io);
};