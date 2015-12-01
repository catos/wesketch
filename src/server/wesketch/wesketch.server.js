var _ = require('lodash');

var gameServer = module.exports = {
    weesketch: {},
    players: []
};


gameServer.init = function (weesketch, next) {
    gameServer.weesketch = weesketch;
    next();
};

gameServer.onMessage = function (message) {
    validateClientMessage(message, function (err, message) {
        if (err) {
            sendMessage('serverError', err.message);
            return;
        }

        switch (message.type) {
            case 'addPlayer': {
                message.type = 'updatePlayers';
                message.value = gameServer.addPlayer(message.value);
                break;
            }
            default: {
                break;
            }
        }

        sendMessage(message.type, message.value);
    });
};

gameServer.addPlayer = function (player) {
    var playerTemplate = {
        id: -1,
        name: '',
        score: 0,
        current: true
    };
    var existingPlayer = _.find(gameServer.players, { name: player.name });

    if (!existingPlayer) {
        var newPlayer = _.merge({}, playerTemplate, player);
        gameServer.players.push(newPlayer);

        sendMessage('chatMessage', {
            timestamp: new Date(),
            type: 'warning',
            message: newPlayer.name + ' joined the game...'
        });

    } else {
        existingPlayer.id = player.id;
    }

    return gameServer.players;
};

gameServer.diconnectClient = function (socketId) {
    var players = _.remove(gameServer.players, { id: socketId });
    if (players.length) {
        sendMessage('chatMessage', {
            timestamp: new Date(),
            type: 'warning',
            message: players[0].name + ' left the game...'
        });
        sendMessage('updatePlayers', gameServer.players);
    } else {
        sendMessage('serverError',
            'Client (socketId = ' + socketId + ') left the game, ' +
            'but the server was unable to remove player from game.');

    }
};


/**
 * Private functions
 */

function sendMessage(type, value) {
    gameServer.weesketch.emit('message', {
        type: type,
        value: value
    });

    if (type !== 'brush') {
        console.log('\n*** sendMessage: type = ' + type + ', value = ' + value);
    }
}

function validateClientMessage(message, cb) {
    var validTypes = [
        'updateSettings',
        'clear',
        'addPlayer',
        'removePlayer',
        'changeTool',
        'brush',
        'chatMessage'
    ];

    if (!message.type) {
        cb(new Error('Invalid client message: type is undefined'));
        return;
    }

    if (validTypes.indexOf(message.type) === -1) {
        cb(new Error('Invalid client message: "' + message.type + '" is not a valid message type.'));
        return;
    }

    cb(null, message);
}
