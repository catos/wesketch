/**
 * pre game:
 *      reset game
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
 *      vent x sekunder
 *      GOTO start round (hvis det er runder igjen)
 *      else
 *      GOTO end game
 *
 *
 * end game:
 *      display the scores!
 *      announce the winner!
 *      GOTO pre game
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

    wordlist: [],

    gameStateTypes: {
        preGame: 0,
        drawing: 1,
        roundEnd: 2,
        endGame: 3
    },
    gameState: {
        state: 0,
        round: 0,
        timer: 10,  // TODO: sett riktig timer when rdy
        drawingPlayer: {},
        currentWord: ''
    }
};


gameServer.init = function (weesketch, next) {
    gameServer.weesketch = weesketch;

    console.log('*** init: should i load wordlist ? wordlist.count = ' + gameServer.wordlist.length);
    if (!gameServer.wordlist.length) {
        gameServer.wordlist = require('./wesketch.wordlist.js');
        console.log('*** init: wordlist loaded! wordlist.count = ' + gameServer.wordlist.length);
    }

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
        };

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

            if (_.every(gameServer.players, { ready: true }) && gameServer.players.length > 1) {
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
    _.forEach(gameServer.players, function (player) {
        player.ready = false;
    });

    // Update game state
    gameServer.gameState.state = gameServer.gameStateTypes.drawing;

    // TODO set timer to 60 when ready
    gameServer.gameState.timer = 10;

    // Increment round-counter
    gameServer.gameState.round++;

    // Choose drawing player
    // TODO: test and finish this step properly
    var playersSorted = _.sortBy(gameServer.players, 'drawCount');
    console.log('playersSorted:', playersSorted);
    playersSorted[0].drawCount++;
    playersSorted[0].isDrawing = true;;

    gameServer.gameState.drawingPlayer = playersSorted[0];

    // Choose new word from wordlist
    gameServer.gameState.currentWord = _.sample(gameServer.wordlist);

    // Send message to players
    var msg = 'Starting round #' + gameServer.gameState.round +
        ', ' + gameServer.gameState.drawingPlayer.name + ' is drawing';
    gameServer.sendServerMessage('info', msg);

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


// // denne henter et random ord fra en array og tar i mot en optional liste av ord som skal ekskluderes
// // (feks ord brukt tidligere i samme runde elnos, hvis du vil hindre det)
// function getWord(wordlist, excludelist) {
//     if (wordlist == undefined) throw "Wordlist is required";
//     if (excludelist == undefined) excludelist = [];
//     if (excludelist.length >= wordlist.length) throw "exclude-list must be shorter than wordlist";

//     var singleWord = wordlist[Math.floor(Math.random() * wordlist.length)];
//     while ($.inArray(singleWord, excludelist) > -1) singleWord = wordlist[Math.floor(Math.random() * wordlist.length)];

//     return singleWord;
// }

// // denne sammenligner original-ordet med et gjettet ord og returnerer følgende:
// // 0 : det var feil
// // 1 : nære men ikke helt riktig
// // 2 : riktig
// function compareWords(original, guess) {
//     original = original.toLowerCase();
//     guess = guess.toLowerCase();
//     if (original === guess) return 2;
//     if (guess.length >= original.length - 2 && original.indexOf(guess) > -1) return 1;
//     return 0;
// }

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
