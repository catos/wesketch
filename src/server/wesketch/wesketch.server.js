var _ = require('lodash');

var gameServer = module.exports = {
    weesketch: {},
    players: []
};


gameServer.init = function (weesketch, next) {
    gameServer.weesketch = weesketch;
    next();
};

gameServer.onClientEvent = function (clientEvent) {
    validateClientEvent(clientEvent, function (err, clientEvent) {
        if (err) {
            sendServerEvent('serverError', err.message);
            return;
        }

        switch (clientEvent.type) {
            case 'addPlayer': {
                clientEvent.type = 'updatePlayers';
                clientEvent.value = gameServer.addPlayer(clientEvent.value);
                break;
            }
            default: {
                break;
            }
        }

        sendServerEvent(clientEvent.type, clientEvent.value);
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

        sendServerEvent('addChatMessage', {
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
        sendServerEvent('addChatMessage', {
            timestamp: new Date(),
            type: 'warning',
            message: players[0].name + ' left the game...'
        });
        sendServerEvent('updatePlayers', gameServer.players);
    } else {
        sendServerEvent('serverError',
            'Client (socketId = ' + socketId + ') left the game, ' +
            'but the server was unable to remove player from game.');

    }
};


/**
 * Private functions
 */

function sendServerEvent(type, value) {
    gameServer.weesketch.emit('serverEvent', {
        type: type,
        value: value
    });

    if (type !== 'brush') {
        console.log('\n*** sendServerEvent: type = ' + type + ', value = ' + value);
    }
}

function validateClientEvent(clientEvent, cb) {
    var validTypes = [
        'updateSettings',
        'clear',
        'addPlayer',
        'removePlayer',
        'changeTool',
        'brush',
        'addChatMessage'
    ];

    if (!clientEvent.type) {
        cb(new Error('Invalid client message: type is undefined'));
        return;
    }

    if (validTypes.indexOf(clientEvent.type) === -1) {
        cb(new Error('Invalid client message: "' + clientEvent.type + '" is not a valid message type.'));
        return;
    }

    cb(null, clientEvent);
}
