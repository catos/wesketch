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

var playerSchema = {
    id: -1,
    email: '',
    name: '',
    ready: false,
    isDrawing: false,
    guessedWordAt: -1,
    drawCount: 0,
    score: 0
};

var server = module.exports = {
    weesketch: {},
    wordlist: [],

    state: {
        phase: 0,
        phaseTypes: {
            preGame: 0,
            drawing: 1,
            roundEnd: 2,
            endGame: 3
        },

        players: [],
        drawingPlayer: {},

        round: 0,

        hintCount: 0,
        hint: '',

        timer: 60,
        stopTimer: true,
        stopReason: '',

        currentWord: '',
    }
};


server.init = function (weesketch, next) {
    server.weesketch = weesketch;

    if (!server.wordlist.length) {
        server.wordlist = require('./wesketch.wordlist.js');
    }

    next();
};

/**
 * onClientEvent
 *
 * Validates and handles all incoming events from the client.
 *
 * client   object              { id: "", name: "" }
 * type:    string              type of event
 * value:   string | object     results may vary
 */
server.onClientEvent = function (client, clientEvent) {
    server.validateClientEvent(clientEvent, function (err, clientEvent) {

        if (err) {
            server.sendServerEvent('serverError', err.message);
            return;
        }

        var clientEvents = clientEvents || {};

        clientEvents.updateState = function () {
            server.sendServerEvent('updateState', server.state);
        };

        clientEvents.addPlayer = function (clientEvent) {
            var player = _.find(server.state.players, { email: clientEvent.player.email });
            if (player) {
                // Update existing player with new id
                player.id = client.id;
                server.sendServerMessage('info', player.name + ' rejoined the game...');
            } else {
                // Create new player
                clientEvent.player.id = client.id;
                player = _.merge({}, playerSchema, clientEvent.player);
                server.state.players.push(player);
                server.sendServerMessage('info', player.name + ' joined the game...');
            }

            server.sendServerEvent('updateState', server.state);
        };

        clientEvents.togglePlayerReady = function (clientEvent) {
            var player = _.find(server.state.players, { id: clientEvent.player.id });
            player.ready = !player.ready;

            var message = (player.ready) ?
                player.name + ' is ready' :
                player.name + ' is not ready';
            server.sendServerMessage('info', message);

            if (_.every(server.state.players, { ready: true }) && server.state.players.length > 1) {
                server.sendServerMessage('info', 'All players are ready!');
                server.startRound();
            }

            server.sendServerEvent('updateState', server.state);
        };

        // TODO: this is wrong!
        clientEvents.giveHint = function (clientEvent) {
            if (server.state.hintCount < 4) {
                server.state.hintCount++;
            }

            if (server.state.hintCount > 1) {
                server.state.hint = server.state.currentWord.substring(0, (server.state.hintCount - 1));
            }

            if (server.state.hintCount > 0) {
                for (var i = server.state.hintCount; i < server.state.currentWord.length; i++) {
                    server.state.hint += ' _ ';
                }
            }

            server.sendServerEvent('updateState', server.state);
        };

        clientEvents.giveUp = function (clientEvent) {
            server.state.stopTimer = true;
            server.state.stopReason = clientEvent.player.name + ' gives up.';
        };

        clientEvents.guessWord = function (clientEvent) {
            
            // Guessing is only allowed in drawing phase
            if (server.state.phase !== server.state.phaseTypes.drawing) {
                server.sendServerMessage('info', 'Guessing is only allowed in drawing phase');
                return;
            }

            var currentWord = server.state.currentWord.toLowerCase();
            var guess = clientEvent.value.message.toLowerCase();

            if (currentWord === guess) {
                server.sendServerMessage('guess-word', clientEvent.player.name + ' guessed the correct word!');
                var player = _.find(server.state.players, { id: clientEvent.player.id });
                player.guessedWordAt = server.state.timer;
    
                // Check if all non-drawing players guess the word
                var playersRemaining = _.some(server.state.players, function (player) {
                    return player.guessedWordAt === -1 && player.isDrawing === false;
                });

                if (!playersRemaining) {
                    server.state.stopTimer = true;
                    server.state.stopReason = 'All players guessed the word!';
                }

                return;
            }

            // TODO: sjekk at dette er korrekt, og impl.
            // var isclosebelow = guess.length >= (currentWord.length - 2) && currentWord.indexOf(guess) > -1;
            // var iscloseabove = guess.length <= (currentWord.length + 2) && guess.indexOf(currentWord) > -1
            if (guess.length >= (currentWord.length - 2) && currentWord.indexOf(guess) > -1) {
                server.sendServerMessage('guess-word', clientEvent.player.name + ' is close...');
                return;
            }

            server.sendServerMessage('guess-word', clientEvent.player.name + ' guessed "' + guess + '"');
        };

        // TODO: update this method at the end of implementation to reset all values...
        clientEvents.resetGame = function (clientEvent) {
            server.state.phase = server.state.phaseTypes.preGame;
            server.state.drawingPlayer = {};
            server.state.round = 0;
            server.state.timer = 60;
            server.state.stopTimer = true;
            server.state.stopReason = '';
            server.state.currentWord = '';
            server.state.hintCount = 0;
            server.state.hint = '';

            server.sendServerEvent('clear');
            server.sendServerEvent('updateState', server.state);
            server.sendServerMessage('info', 'Game was reset by ' + clientEvent.player.name);
        };

        clientEvents.testCode = function (clientEvent) {
            var endGamePlz = _.some(server.state.players, function (player) {
                return player.drawCount < 3;
            });

            console.log('endGamePlz: ' + endGamePlz);

        };

        clientEvents.default = function (clientEvent) {
            server.sendServerEvent(clientEvent.type, clientEvent.value);
        };

        if (clientEvents[clientEvent.type]) {
            return clientEvents[clientEvent.type](clientEvent);
        } else {
            return clientEvents.default(clientEvent);
        }
    });
};

/**
 * Disconnect Client
 */
server.onClientDisconnected = function (clientId) {
    console.log('[onClientDisconnected] clientId: ' + clientId);
    _.remove(server.state.players, { id: clientId });
    server.sendServerEvent('updateState', server.state);
};

/**
 * Start round
 */
server.startRound = function () {

    // Update game phase
    server.state.phase = server.state.phaseTypes.drawing;

    // Clear ready on all players
    _.forEach(server.state.players, function (player) {
        player.ready = false;
    });

    // Increment round-counter
    server.state.round++;

    // Choose drawing player
    var playersSorted = _.sortBy(server.state.players, 'drawCount');
    playersSorted[0].drawCount++;
    playersSorted[0].isDrawing = true;
    server.state.drawingPlayer = playersSorted[0];

    // Choose new word from wordlist.
    server.state.hintCount = 0;
    server.state.hint = '';
    server.state.currentWord = _.sample(server.wordlist);

    // Send message to players
    var msg = 'Starting round #' + server.state.round +
        ', ' + server.state.drawingPlayer.email + ' is drawing';
    server.sendServerMessage('info', msg);

    // Update clients with altered state  
    server.sendServerEvent('updateState', server.state);

    // Start timer
    server.startTimer(60, server.endRound);
};

/**
 * Drawing Loop
 *
 * End phase conditions:
 * 1. Time runs out
 * 2. Drawing player gives up
 * 3. All players (except drawing player) guess the word
 */
server.startTimer = function (duration, next) {
    server.state.timer = duration;
    server.state.stopTimer = false;
    server.state.stopReason = '';

    var intervalId = setInterval(loop, 1000);

    function loop() {
        if (server.state.timer <= 0) {
            server.state.stopTimer = true;
            server.state.stopReason = 'Times up!';
        }

        if (server.state.stopTimer) {
            clearInterval(intervalId);
            next();
        } else {
            server.state.timer--;
        }

        server.sendServerEvent('updateTimer', server.state.timer);
    }
};

/**
 * End round.
 */
server.endRound = function () {

    // Check if End game yet ...
    var endGame = _.all(server.state.players, function (player) {
        return player.drawCount === 3;
    });

    if (endGame) {
        server.endGame('All players have drawn 3 times.');
        return;
    }    
    
    // Update game state
    server.state.phase = server.state.phaseTypes.roundEnd;

    // Send message to players
    server.sendServerMessage('info', '*** Round ended, because: ' + server.state.stopReason);

    // Present the word
    server.sendServerMessage('info', 'The word was: ' + server.state.currentWord);

    // Distribute points & reset players
    var drawingPlayer = _.find(server.state.players, { id: server.state.drawingPlayer.id });
    _.forEach(server.state.players, function (player) {

        if (player.guessedWordAt > -1) {
            player.score++;
            drawingPlayer.score++;
        }

        player.guessedWordAt = -1;
        player.isDrawing = false;
    });

    // TODO: Set timer to 30 seconds and begin next round
    server.startTimer(10, server.startRound);
    server.sendServerMessage('info', 'Next round starts in 30 seconds...');

    // Clear the drawing area
    server.sendServerEvent('clear');
    
    // Reset drawing player to disable drawing player features while waiting for next turn
    server.state.drawingPlayer = {};

    // Update clients with altered state  
    server.sendServerEvent('updateState', server.state);

};

/**
 * End game
 */
server.endGame = function () {

    // Update game state
    server.state.phase = server.state.phaseTypes.endGame;

    // Send message to players
    server.sendServerMessage('info', 'Welcome to server.endGame');

};

/**
 * Send Server Message
 */
server.sendServerMessage = function (type, message) {
    server.sendServerEvent('addMessage', {
        timestamp: new Date(),
        type: type,
        message: message
    });
};

/**
 * Send Server Event.
 */
server.sendServerEvent = function (type, value) {
    
    // TODO: 'updateState' exclude currentword for all players except drawingplayer
    
    server.weesketch.emit('serverEvent', {
        type: type,
        value: value
    });

    if (type === 'brush') {
        return;
    }

    if (type === 'addMessage') {
        value = value.message;
    }

    console.log('[ SSE ] ' + type + ':\t' + value);
};

/**
 * Validate Client Event
 */
server.validateClientEvent = function (clientEvent, cb) {
    var validTypes = [
        'giveHint',
        'giveUp',
        'testCode',
        'resetGame',
        'guessWord',
        'updateState',
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
