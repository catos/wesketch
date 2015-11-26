var _ = require('lodash');

var playerTemplate = {
    id: -1,
    name: '',
    score: 0,
    current: true
}
var players = [];

// TODO: do i really want an object literal here ? ...
module.exports = {
    players: players,

    validateClientMessage: function (message, cb) {
        var validTypes = [
            'update-settings',
            'clear',
            'player-joined',
            'change-tool',
            'brush'
        ];

        if (!message.type) {
            cb(new Error('Type is undefined'));
            return;
        }

        if (validTypes.indexOf(message.type) === -1) {
            cb(new Error('Invalid type: "' + message.type + '"'));
            return;
        }

        cb(null, message);
    },

	addPlayer: function (player) {
        var playerExist = false;
        for (var i = 0; i < players.length; i++) {
            if (players[i].name === player.name) {
                playerExist = true;

                // TODO: this is not working as nintendo                
                // Update id
                players[i].id = player.id;
            }
        }

        if (!playerExist) {
            players.push(
                _.merge({}, playerTemplate, player)
                );
        }
        
        return players;
    }
};