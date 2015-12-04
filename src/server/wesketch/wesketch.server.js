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
    hasGuessedWord: false,
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
        timer: 60,
        currentWord: '',
        stopTimer: false
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
                // Create new player
                player.id = client.id;
                server.sendServerMessage('info', player.email + ' rejoined the game...');
            } else {
                // Update existing player with new id
                clientEvent.player.id = client.id;
                player = _.merge({}, playerSchema, clientEvent.player);
                server.state.players.push(player);
                server.sendServerMessage('info', player.email + ' joined the game...');
            }

            server.sendServerEvent('updateState', server.state);
        };

        clientEvents.togglePlayerReady = function (clientEvent) {
            var player = _.find(server.state.players, { id: clientEvent.player.id });
            player.ready = !player.ready;

            var message = (player.ready) ?
                player.email + ' is ready' :
                player.email + ' is not ready';
            server.sendServerMessage('info', message);

            if (_.every(server.state.players, { ready: true }) && server.state.players.length > 1) {
                server.sendServerMessage('info', 'All players are ready!');
                server.startRound();
            }

            server.sendServerEvent('updateState', server.state);
        };

        clientEvents.guessWord = function (clientEvent) {
            var currentWord = server.state.currentWord.toLowerCase();
            var guess = clientEvent.value.message.toLowerCase();

            if (currentWord === guess) {
                server.sendServerMessage('guess-word', clientEvent.player.email + ' guessed the correct word!');
                var player = _.find(server.state.players, { id: clientEvent.player.id });
                player.hasGuessedWord = true;
                return;
            }

            // TODO: sjekk at dette er korrekt, og impl.
            // var isclosebelow = guess.length >= (currentWord.length - 2) && currentWord.indexOf(guess) > -1;
            // var iscloseabove = guess.length <= (currentWord.length + 2) && guess.indexOf(currentWord) > -1
            if (guess.length >= (currentWord.length - 2) && currentWord.indexOf(guess) > -1) {
                server.sendServerMessage('guess-word', clientEvent.player.email + ' is close...');
                return;
            }

            server.sendServerMessage('guess-word', clientEvent.player.email + ' guessed "' + guess + '"');
        };

        // TODO: update this method at the end of implementation to reset all values...
        clientEvents.resetGame = function (clientEvent) {
            // server.state.phase = 0;
            // server.state.round = 0;
            // server.state.timer = 60;
            // server.state.drawingPlayer = {};
            // server.state.currentWord = '';
            // server.state.stopTimer = true;

            // // TODO: update with who did this ?...
            // server.sendServerMessage('info', 'Game was reset');

            // clientEvents.updateState();
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
    console.log('\n*** onClientDisconnected: clientId = ' + clientId);
    _.remove(server.state.players, { id: clientId });
    server.sendServerEvent('updateState', server.state);
};

/**
 * Start round
 */
server.startRound = function () {

    // Clear ready on all players
    _.forEach(server.state.players, function (player) {
        player.ready = false;
    });

    // Update game state
    server.state.phase = server.state.phaseTypes.drawing;

    // Reset timer
    server.state.timer = 60;

    // Increment round-counter
    server.state.round++;

    // Choose drawing player
    // TODO: test and finish this step properly
    var playersSorted = _.sortBy(server.state.players, 'drawCount');
    console.log('playersSorted:', playersSorted);
    playersSorted[0].drawCount++;
    playersSorted[0].isDrawing = true;

    server.state.drawingPlayer = playersSorted[0];

    // Choose new word from wordlist.
    server.state.currentWord = _.sample(server.wordlist);

    // Send message to players
    var msg = 'Starting round #' + server.state.round +
        ', ' + server.state.drawingPlayer.email + ' is drawing';
    server.sendServerMessage('info', msg);

    // Start timer
    server.startTimer();
};

/**
 * End round
 */
server.endRound = function (reason) {

    // Announce round winner
    // server.sendServerMessage(
    //     'guess-word',
    //     player + ' guessed the correct word "' + server.state.currentWord + '"!');

    // Stop the timer
    server.state.stopTimer = true;
};

/**
 * Drawing Loop
 *
 * End phase conditions:
 * 1. Time runs out
 * 2. Drawing player concedes
 * 3. All players (except drawing player) guess the word
 */
server.startTimer = function (duration) {
    var intervalId = setInterval(drawingLoop, 1000);

    function drawingLoop() {

        var stopTimer = false;
        var stopReason = '';

        if (server.state.timer <= 0) {
            stopTimer = true;
            stopReason = 'Time ran out...';
        }

        // if (drawing.player.concedes) {
        //     stopTimer = true;
        // }

        // if (all.players.guessed right) {
        //     stopTimer = true;
        // }

        if (stopTimer) {
            clearInterval(intervalId);
            return;
        }


        server.state.timer--;

        // TODO: exclude currentword for all players except drawingplayer
        server.sendServerEvent('updateState', server.state);
    }
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

    if (type !== 'brush') {
        console.log('\n*** sendServerEvent: type = ' + type + ', value = ' + value);
    }
};

/**
 * Validate Client Event
 */
server.validateClientEvent = function (clientEvent, cb) {
    var validTypes = [
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
