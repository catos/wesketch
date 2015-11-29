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

gameServer.onMessage = function (client, message) {

    validateClientMessage(message, function (err, message) {
        if (err) {
            client.emit('message', {
                type: 'error',
                value: err.message
            });
            return;
        }

        switch (message.type) {
            case 'brush': {
                break;
            }
            // case 'add-player': {
            //     message.type = 'update-players';
            //     message.value = gameServer.addPlayer(message.value);
            //     break;
            // }
            // case 'remove-player': {
            //     message.type = 'update-players';
            //     message.value = gameServer.removePlayer(message.value);
            //     break;
            // }
            default: {
                console.log(message);
            }
        }

        client.emit('message', message);
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

    var existingPlayer = _.find(gameServer.players, { 'name': player.name });
    if (!existingPlayer) {
        console.log('player does NOT already exist');
        gameServer.players.push(
            _.merge({}, playerTemplate, player)
            );
    } else {
        console.log(
            'player ' + player.name + 
            ' already exist, old id = ' + existingPlayer.id + 
            ', newid = ' + player.id);
        existingPlayer.id = player.id;
    }
    
    return gameServer.players;
};

gameServer.removePlayer = function (player) {
    gameServer.players.pop(player);
    console.log('Player removed: ', player);
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
