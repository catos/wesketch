var _ = require('lodash');

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

        round: 0,
        roundsTotal: 0,

        hintCount: 0,
        hint: '',
        currentWord: '',

        timer: {
            remaining: 90,
            stop: false,
            stopAndReset: false
        }
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
server.onClientEvent = function (clientEvent) {
    server.validateClientEvent(clientEvent, function (err, clientEvent) {
        if (err) {
            server.sendServerEvent('serverError', err.message);
            return;
        }

        var clientEvents = module.exports = clientEvents || {};

        clientEvents.updateState = function () {
            server.sendServerEvent('updateState', server.state);
        };

        clientEvents.updateDrawSettings = function (clientEvent) {
            // Only drawing player can change drawSettings
            var drawingPlayer = _.find(server.state.players, { isDrawing: true });
            if (drawingPlayer.id === clientEvent.player.id) {
                server.sendServerEvent(clientEvent.type, clientEvent.value);
            }
        };

        clientEvents.clear = function (clientEvent) {
            // Only drawing player can change drawSettings
            var drawingPlayer = _.find(server.state.players, { isDrawing: true });
            if (drawingPlayer.id === clientEvent.player.id) {
                server.sendServerEvent(clientEvent.type, clientEvent.value);
            }
        };

        clientEvents.addPlayer = function (clientEvent) {
            var playerSchema = {
                id: -1,
                email: '',
                name: '',
                ready: false,
                isDrawing: false,
                guessedWord: false,
                drawCount: 0,
                score: 0
            };

            var player = _.find(server.state.players, { email: clientEvent.player.email });
            if (player) {
                // Update existing player with new id
                player.id = clientEvent.clientId;
                server.sendServerMessage('info', player.name + ' rejoined the game...');
            } else {
                // Create new player
                clientEvent.player.id = clientEvent.clientId;
                player = _.merge({}, playerSchema, clientEvent.player);
                server.state.players.push(player);

                // Update roundsTotal
                server.state.roundsTotal = server.state.players.length * 3;

                server.sendServerMessage('info', player.name + ' joined the game...');
            }

            server.sendServerEvent('playSound', 'playerJoined');
            server.sendServerEvent('updateState', server.state);
        };

        clientEvents.togglePlayerReady = function (clientEvent) {
            var player = _.find(server.state.players, { id: clientEvent.player.id });

            if (player === undefined) {
                server.sendServerEvent('serverError', 'Could not find player with id = ' + clientEvent.player.id);
                return;
            }

            player.ready = !player.ready;

            var message = (player.ready) ?
                player.name + ' is ready' :
                player.name + ' is not ready';
            server.sendServerMessage('info', message);

            if (_.every(server.state.players, { ready: true }) && server.state.players.length > 1) {
                server.sendServerMessage('info', 'All players are ready!');
                server.startRound();
            }

            if (player.ready) {
                server.sendServerEvent('playSound', 'playerReady');
            } else {
                server.sendServerEvent('playSound', 'playerNotReady');
            }

            server.sendServerEvent('updateState', server.state);
        };

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
            server.state.timer.stop = true;
            server.sendServerMessage('info', clientEvent.player.name + ' gives up.');
        };

        clientEvents.guessWord = function (clientEvent) {
            // Guessing is only allowed in drawing phase
            if (server.state.phase !== server.state.phaseTypes.drawing) {
                server.sendServerMessage('info', 'Guessing is only allowed in drawing phase');
                return;
            }

            var currentWord = server.state.currentWord.toLowerCase();
            var guess = clientEvent.value.message.toLowerCase();

            // Someone guessed correct!
            if (currentWord === guess) {
                
                var finishedPlayers = _.where(server.state.players, { 'guessedWord': true, 'isDrawing': false })
                var firstGuess = finishedPlayers.length === 0;
                var player = _.find(server.state.players, { id: clientEvent.player.id });
                var drawingPlayer = _.find(server.state.players, { isDrawing: true });

                // Play sound & send message
                server.sendServerEvent('playSound', 'playerRightAnswer');
                server.sendServerMessage('guess-word', clientEvent.player.name + ' guessed the correct word!');

                // Calculate playerScore
                var playerScore = 10 - finishedPlayers.length;
                if (playerScore < 5) {
                    playerScore = 5;
                }
                
                // Update player score
                player.score += playerScore;
                player.guessedWord = true;

                // Update drawingPlayer score
                var drawingPlayerScore = firstGuess ? 10 : 1;
                drawingPlayer.score += drawingPlayerScore;

                // Check if all non-drawing players guessed the word
                var playersRemaining = _.some(server.state.players, function (player) {
                    return !player.guessedWord && !player.isDrawing;
                });
                if (!playersRemaining) {
                    server.state.timer.stop = true;
                    server.sendServerMessage('info', 'All players guessed the word!');
                    return;
                }

                // Reduce timer after first guess
                if (firstGuess && server.state.timer.remaining > 30) {
                    server.state.timer.remaining = 30;
                }
                    
                server.sendServerEvent('updateState', server.state);
                
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

        clientEvents.resetGame = function (clientEvent) {
            server.resetGame();
            server.sendServerEvent('clear');
            server.sendServerMessage('info', 'Game was reset by ' + clientEvent.player.name);
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

    if (server.state.players.length <= 0) {
        console.log('All clients left, reset the game');
        server.resetGame();
        return;
    }

    server.sendServerEvent('updateState', server.state);
};

/**
 * Reset game aka. Pre game
 */
server.resetGame = function () {
    server.state.phase = server.state.phaseTypes.preGame;
    server.state.round = 0;

    server.state.timer.remaining = 90;
    server.state.timer.stop = true;
    server.state.timer.stopAndReset = true;

    server.state.hintCount = 0;
    server.state.hint = '';

    server.state.currentWord = '';

    _.forEach(server.state.players, function (player) {
        player.ready = false;
        player.isDrawing = false;
        player.guessedWord = false;
        player.drawCount = 0;
        player.score = 0;
    });

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
    var drawingPlayer = playersSorted[0];
    drawingPlayer.drawCount++;
    drawingPlayer.isDrawing = true;

    // Choose new word from wordlist.
    server.state.hintCount = 0;
    server.state.hint = '';
    server.state.currentWord = _.sample(server.wordlist);

    // Send message to players
    server.sendServerMessage(
        'important',
        'Starting round ' + server.state.round + ', ' + drawingPlayer.name + ' is drawing');

    // Update clients with altered state
    server.sendServerEvent('updateState', server.state);

    // Start timer
    server.startTimer(90, server.endRound);
};

/**
 * Drawing Loop
 *
 * End phase conditions:
 * 1. Time runs out
 * 2. Drawing player gives up
 * 3. All players (except drawing player) guess the word
 * 4. Reset game
 */
server.startTimer = function (duration, next) {
    server.state.timer.remaining = duration;
    server.state.timer.stop = false;
    server.state.timer.stopAndReset = false;

    var intervalObj = setInterval(loop, 1000);

    function loop() {
        if (server.state.timer.remaining <= 0) {
            server.state.timer.stop = true;
        }

        if (server.state.timer.stop) {
            clearInterval(intervalObj);

            if (!server.state.timer.stopAndReset) {
                return next();
            }
        } else {
            server.state.timer.remaining--;
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
        server.sendServerMessage('info', 'All players have drawn 3 times.');
        server.endGame();
        return;
    }

    // Update game state
    server.state.phase = server.state.phaseTypes.roundEnd;

    // Present the word
    server.sendServerMessage('info', 'The word was: ' + server.state.currentWord);

    // Reset players
    // TODO: revider reset players
    _.forEach(server.state.players, function (player) {
        player.guessedWord = false;
        player.isDrawing = false;
    });

    server.startTimer(10, server.startRound);
    server.sendServerMessage('important', 'Next round starts in 10 seconds...');

    // Clear the drawing area
    server.sendServerEvent('clear');

    // Update clients with altered state
    server.sendServerEvent('updateState', server.state);

};

/**
 * End game
 */
server.endGame = function () {

    // Update game state
    server.state.phase = server.state.phaseTypes.endGame;

    server.startTimer(30, server.resetGame);
    server.sendServerMessage('important', 'Game ends in 30 seconds...');

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
    server.weesketch.emit('serverEvent', {
        type: type,
        value: value
    });

    if (type === 'brush' || type === 'updateTimer') {
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
        'playSound',
        'giveHint',
        'giveUp',
        'testCode',
        'resetGame',
        'guessWord',
        'updateState',
        'updateDrawSettings',
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
