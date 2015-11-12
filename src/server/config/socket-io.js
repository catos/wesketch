var moment = require('moment');

module.exports = function (app, settings) {
	var http = require('http').Server(app);
	var io = require('socket.io')(http);

	io.on('connection', function (socket) {

		// sendMessage(socket, 'user-join', 'User joined message!');
		io.emit('user-join', {
			name: socket.id
		});

		socket.on('user-message', function (message) {
			message.timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
			console.log('[ WS user-message ] - ', message);
			io.emit('user-message', message);
			// socket.broadcast.emit('user-message', message);
		});

		socket.on('disconnect', function () {
			console.log('[ WS disconnect ] - User disconnected');
		});

	});

	http.listen(settings.websocketsPort, function () {
		console.log('listening on *:' + settings.websocketsPort);
	});

	// function sendMessage(socket, event, message) {
	// 	// io.emit('user-message', message);
		
	// 	socket.broadcast.emit('user-message', message);
	// 	console.log('[ WS ' + event + ' ] - ' + message);
	// }
}