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

// TODO: wtb bedre navn enn weesketch som parameter her...
gameServer.onMessage = function (weesketch, message) {

    validateClientMessage(message, function (err, message) {
        if (err) {
            weesketch.emit('message', {
                type: 'error',
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
    // console.log(gameServer.players);
    // var playerExist = false;
    // for (var i = 0; i < gameServer.players.length; i++) {
    //     if (gameServer.players[i].name === player.name) {
    //         playerExist = true;

    //         // TODO: this is not working as nintendo                
    //         // Update id
    //         gameServer.players[i].id = player.id;
    //     }
    // }
    console.log('\n\n*** wesketch.server.js -> addPlayer *******');
    console.log('[gameServer.addPlayer] name = ' + player.name + ', id = ' + player.id);
    var existingPlayer = _.find(gameServer.players, { 'name': player.name });
    if (!existingPlayer) {
        console.log('player does NOT already exist');
        gameServer.players.push(
            _.merge({}, playerTemplate, player)
            );
    } else {
        console.log(
            '[gameServer.addPlayer] player ' + player.name + 
            ' already exist, old id = ' + existingPlayer.id + 
            ', newid = ' + player.id);
        existingPlayer.id = player.id;
    }
    
    console.log(gameServer.players);
    
    return gameServer.players;
};

// TODO: wtb bedre navn enn weesketch som parameter her...
gameServer.diconnectClient = function (weesketch, clientId) {
    console.log('\n\n*** wesketch.server.js -> diconnectClient *******');
    console.log('[gameServer.removePlayer] socket.id = ' + clientId);
    var player = _.find(gameServer.players, { id: clientId });
    if (player) {
        gameServer.players.pop(player);    
        console.log('Player removed: ', player);
    } else {
        console.log('Player not found...');
    }
    weesketch.emit('message', {
        type: 'update-players',
        value: gameServer.players
    });
    console.log(gameServer.players);
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
