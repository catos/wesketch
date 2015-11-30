var _ = require('lodash');

var gameServer = module.exports = {
    players: []
};

// TODO: WTS weesketch from all these methods, maybe init() is the answer afterall ?
gameServer.onMessage = function (weesketch, message) {

    validateClientMessage(message, function (err, message) {
        if (err) {
            sendMessage(weesketch, 'server-error', err.message);
            return;
        }

        switch (message.type) {
            case 'add-player': {
                message.type = 'update-players';
                message.value = gameServer.addPlayer(weesketch, message.value);
                break;
            }
            default: {
                break;
            }
        }

        sendMessage(weesketch, message.type, message.value);
    });

};

gameServer.addPlayer = function (weesketch, player) {
    var playerTemplate = {
        id: -1,
        name: '',
        score: 0,
        current: true
    };
    var existingPlayer = _.find(gameServer.players, { 'name': player.name });

    if (!existingPlayer) {
        var newPlayer = _.merge({}, playerTemplate, player);            
        gameServer.players.push(newPlayer);
        sendMessage(weesketch, 'chat-event', newPlayer.name + ' joined the game...');
    } else {
        existingPlayer.id = player.id;
    }

    return gameServer.players;
};

gameServer.diconnectClient = function (weesketch, socketId) {
    var players = _.remove(gameServer.players, { id: socketId });
    if (players.length) {
        sendMessage(weesketch, 'chat-event', players[0].name + ' left the game...');
        sendMessage(weesketch, 'update-players', gameServer.players);
    } else {
        var msg = 
            'Client (socketId = ' + socketId + ') left the game, ' +
            'but the server was unable to remove player from game.';
            
        sendMessage(weesketch, 'chat-error', msg);
            
    }
};

/**
 * Private functions
 */

function sendMessage(weesketch, type, value) {
    weesketch.emit('message', {
        type: type,
        value: value
    });

    if (type !== 'brush') {
        console.log('sendMessage: type = ' + type + ', value = ', value);
    }
}

function validateClientMessage(message, cb) {
    var validTypes = [
        'update-settings',
        'clear',
        'add-player',
        'remove-player',
        'change-tool',
        'brush'
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
