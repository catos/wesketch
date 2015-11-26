module.exports = function (io) {
    var players = [];

    var chat = io
        .of('/chat')
        .on('connection', function (socket) {

            socket.on('message', function (message) {

                switch (message.type) {
                    case 'brush': {
                        break;
                    }
                    case 'player-joined': {
                        addPlayer(message.value);
                        message.value = players;
                        break;
                    }
                    default: {
                        console.log(message);
                    }
                }

                chat.emit('message', message);
            });
        });

    function addPlayer(player) {
        var playerExist = false;
        for (var i = 0; i < players.length; i++) {
            if (players[i].name === player.name) {
                playerExist = true;
            }
        }

        if (!playerExist) {
            players.push(player);
        }
    }
};
