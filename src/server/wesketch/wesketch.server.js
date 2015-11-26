var players = [];

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
            }
        }

        if (!playerExist) {
            players.push(player);
        }
    }
};