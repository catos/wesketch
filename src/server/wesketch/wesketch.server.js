var _ = require('lodash');

var playerTemplate = {
    id: -1,
    name: '',
    score: 0,
    current: true
};

var gameServer = module.exports = {
    players: []
};

// TODO: lag metode sendMessage, some igjen inneholder message-type...
// TODO: wtb bedre navn enn weesketch som parameter her...
gameServer.onMessage = function (weesketch, message) {

    validateClientMessage(message, function (err, message) {
        if (err) {
            // TODO: bruk ny metode gameServer.sendMessage
            weesketch.emit('message', {
                type: 'server-error',
                value: err.message
            });
            return;
        }

        switch (message.type) {
            case 'brush': {
                break;
            }
            case 'add-player': {
                message.type = 'update-players';
                message.value = gameServer.addPlayer(message.value);
                break;
            }
            default: {
                console.log(message);
            }
        }

        weesketch.emit('message', message);
    });

};

gameServer.addPlayer = function (player) {
    var existingPlayer = _.find(gameServer.players, { 'name': player.name });
    if (!existingPlayer) {
        gameServer.players.push(
            _.merge({}, playerTemplate, player)
            );
    } else {
        existingPlayer.id = player.id;
    }

    return gameServer.players;
};

// TODO: wtb bedre navn enn weesketch som parameter her...
gameServer.diconnectClient = function (weesketch, socketId) {
    // TODO: Send melding til andre klienter om at player har left...
    // TODO: bruk ny metode gameServer.sendMessage
    _.remove(gameServer.players, { id: socketId });

    weesketch.emit('message', {
        type: 'update-players',
        value: gameServer.players
    });
};

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
