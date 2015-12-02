/**
 * pre game: 
 *      before players have all clicked [ Ready ]
 *      if all players are ready
 *          GOTO start round
 *  
 * start round:
 *      reset timer, 
 *      choose drawing player, 
 *      increment round
 *      start timer
 *      GOTO running
 * 
 * running:
 *      IF timer runs out || all players have guessed the word || drawingPlayer gives up 
 *      GOTO end round
 * 
 * 
 * end round: 
 *      show the word, 
 *      distribute points to players,
 *      GOTO start round
 *  
 * end game: 
 *      display the scores!
 *      announce the winner!
 * 
 */


var _ = require('lodash');

var gameServer = module.exports = {
    weesketch: {},
    playerSchema: {
        id: -1,
        name: '',
        ready: false,
        isDrawing: false,
        drawCount: 0,
        score: 0
    },
    players: [],
    
    gameStateTypes: {
        preGame: 0,
        drawing: 1,
        roundEnd: 2,
        endGame: 3
    },
    gameState: {
        state: 0,
        round: 0,
        timer: 60,
        drawingPlayer: {},
    }
};


gameServer.init = function (weesketch, next) {
    gameServer.weesketch = weesketch;
    next();
};

gameServer.onClientEvent = function (clientEvent) {
    gameServer.validateClientEvent(clientEvent, function (err, clientEvent) {

        if (err) {
            gameServer.sendServerEvent('serverError', err.message);
            return;
        }

        var clientEvents = clientEvents || {};

        clientEvents.updateGameState = function (clientEvent) {
            gameServer.sendServerEvent('updateGameState', gameServer.gameState);
        }

        clientEvents.addPlayer = function (clientEvent) {
            var player = clientEvent.value;
            var existingPlayer = _.find(gameServer.players, { name: player.name });

            if (!existingPlayer) {
                var newPlayer = _.merge({}, gameServer.playerSchema, player);
                
                // First player starts drawing
                if (gameServer.players.length === 0) {
                    newPlayer.isDrawing = true;
                }

                gameServer.players.push(newPlayer);
                gameServer.sendServerMessage('info', newPlayer.name + ' joined the game...');
            } else {
                existingPlayer.id = player.id;
            }

            gameServer.sendServerEvent('updatePlayers', gameServer.players);
        };

        clientEvents.togglePlayerReady = function (clientEvent) {
            var player = _.find(gameServer.players, { id: clientEvent.value.id });
            player.ready = !player.ready;

            var message = (player.ready) ?
                player.name + ' is ready' :
                player.name + ' is not ready';
            gameServer.sendServerMessage('info', message);

            if (_.every(gameServer.players, { ready: true })) {
                gameServer.sendServerMessage('info', 'All players are ready!');
                gameServer.startRound();
            }

            gameServer.sendServerEvent('updatePlayers', gameServer.players);
        };

        clientEvents.default = function (clientEvent) {
            gameServer.sendServerEvent(clientEvent.type, clientEvent.value);
        };

        if (clientEvents[clientEvent.type]) {
            return clientEvents[clientEvent.type](clientEvent);
        } else {
            return clientEvents.default(clientEvent);
        }
    });
};

/**
 * Event functions
 */

gameServer.diconnectClient = function (socketId) {
    var players = _.remove(gameServer.players, { id: socketId });
    if (players.length) {
        gameServer.sendServerMessage('warning', players[0].name + ' left the game...');
        gameServer.sendServerEvent('updatePlayers', gameServer.players);
    } else {
        gameServer.sendServerEvent('serverError',
            'Client (socketId = ' + socketId + ') left the game, ' +
            'but the server was unable to remove player from game.');
    }
};

/**
 * Helper functions
 */

//  * start round:
//  *      choose drawing player, 
//  *      clear ready on all players...
//  *      GOTO running
gameServer.startRound = function () {

    // Clear ready on all players
    _.forEach(gameServer.players, function(player) {
        player.ready = false;
    });

    // Update game state
    gameServer.gameState.state = gameServer.gameStateTypes.drawing;
    
    // TODO set timer to 60 when ready
    gameServer.gameState.timer = 10;
    
    // Increment round-counter
    gameServer.gameState.round++;

    // Choose drawing player
    var playersSorted = _.sortBy(gameServer.players, 'drawCount');
    console.log('playersSorted:', playersSorted);
    playersSorted[0].drawCount++;
    playersSorted[0].isDrawing = true;;
    
    gameServer.gameState.drawingPlayer = playersSorted[0];

    // Send message to players
    gameServer.sendServerMessage('info', 'Starting round #' + gameServer.gameState.round);
    
    // Start timer
    gameServer.startTimer();
}

gameServer.startTimer = function (duration) {
    var intervalId = setInterval(updateTimer, 1000);

    function updateTimer() {
        if (gameServer.gameState.timer <= 0) {
            clearInterval(intervalId);
            return;
        }

        gameServer.gameState.timer--;
        gameServer.sendServerEvent('updateGameState', gameServer.gameState);
    }
}

gameServer.sendServerMessage = function (type, message) {
    gameServer.sendServerEvent('addMessage', {
        timestamp: new Date(),
        type: type,
        message: message
    });
};

gameServer.sendServerEvent = function (type, value) {
    gameServer.weesketch.emit('serverEvent', {
        type: type,
        value: value
    });

    if (type !== 'brush') {
        console.log('\n*** sendServerEvent: type = ' + type + ', value = ' + value);
    }
};

gameServer.validateClientEvent = function (clientEvent, cb) {
    var validTypes = [
        'updateGameState',
        'updateSettings',
        'clear',
        'addPlayer',
        'removePlayer',
        'changeTool',
        'brush',
        'addMessage',
        'togglePlayerReady'
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
};
