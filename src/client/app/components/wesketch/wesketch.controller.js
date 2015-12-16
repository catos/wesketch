/* global Howl */
(function () {
    'use strict';

    angular
        .module('components.wesketch')
        .controller('WesketchController', WesketchController);

    WesketchController.$inject = ['alert', 'sawkit', 'tokenIdentity'];

    function WesketchController(alert, sawkit, tokenIdentity) {
        /**
         * Private variables
         */
        var tools = ['brush', 'eraser', 'fill'];
        var colors = [
            '#000000', '#696969', '#808080',
            '#c0c0c0', '#f5f5f5', '#ffffff',
            '#ff0000', '#00ff00', '#0000ff',
            '#ff0', '#0ff', '#f0f',
            '#800', '#808000',
            '#008000', '#800080', '#008080',
            '#000080'
        ];
        var sfx = {};

        /**
         * Viewmodel variables
         */
        var vm = this;
        vm.canvas = null;
        vm.ctx = null;
        vm.drawing = false;
        vm.coords = {
            from: {
                x: 0,
                y: 0
            },
            to: {
                x: 0,
                y: 0
            }
        };

        vm.player = {
            id: -1,
            email: ''
        };

        vm.state = {};
        vm.myMessages = [];
        vm.inputGuessMode = false;
        vm.chatMessages = [];
        vm.newMessage = '';

        // TODO: lag en generell toggle-functino ?
        // TODO: og så trenger jeg booleans til view etterpå
        vm.soundSettings = {
            muteSfx: false,
            muteMusic: false
        };

        vm.drawSettings = {
            lineWidth: 2,
            lineJoin: 'round', // 'butt', 'round', 'square'
            lineCap: 'round', // 'bevel', 'round', 'miter',

            currentTool: tools[0],
            tools: tools,

            strokeStyle: colors[0],
            colors: colors,
        };

        // TODO: remove later...
        vm.messagesElement = {};

        /**
         * Viewmodel functions
         */
        vm.toggleSoundSettings = toggleSoundSettings;
        vm.setInputGuessMode = setInputGuessMode;
        vm.sendClientEvent = sendClientEvent;
        vm.addMessage = addMessage;
        vm.onInputKey = onInputKey;

        /**
         * Developer
         */
        vm.isAdmin = false;


        init();

        function init() {
            sawkit.connect('weesketch');

            // TODO: dette er vel ikke helt spa, hva med å sende med som
            // parameter fra directive, eller bruke angular.element ?
            vm.canvas = document.getElementById('canvas');
            vm.messagesElement = document.getElementById('messages');
            if (vm.canvas !== undefined) {
                vm.canvas.onmousedown = onMouseDown;
                vm.canvas.onmouseup = onMouseUp;
                vm.canvas.onmousemove = onMouseMove;
                vm.canvas.onmouseleave = onMouseLeave;
                vm.ctx = vm.canvas.getContext('2d');
            }

            // Add player to the game
            vm.player.id = -1;
            vm.player.email = tokenIdentity.currentUser.email;
            vm.player.name = tokenIdentity.currentUser.name;
            vm.sendClientEvent('addPlayer', vm.player);

            vm.isAdmin = tokenIdentity.isAdmin();

            prepareSounds(function () {
                console.log('Finished preparing sounds.');
            });
        }

        function prepareSounds(next) {

            sfx.playerJoined = addSfx('SUCCESS TUNE Happy Sticks Short 01.wav');
            sfx.playerReady = addSfx('TECH INTERFACE Computer Beeps 08.wav');
            sfx.playerNotReady = addSfx('TECH INTERFACE Computer Terminal Beeps Negative 01.wav');
            sfx.playerRightAnswer = addSfx('SUCCESS PICKUP Collect Beep 02.wav');
            sfx.endRoundNoCorrect = addSfx('SUCCESS TUNE Win Ending 09.wav');
            sfx.endGame = addSfx('SUCCESS TUNE Win Complete 07.wav');

            next();

            function addSfx(path) {
                var defaults = {
                    buffer: true,
                    urls: [''],
                    volume: 0.1
                };
                return new Howl(angular.extend({}, defaults, { urls: ['/sfx/' + path] }));
            }
        }

        /**
         * Client events
         */
        function onMouseDown(event) {
            vm.coords.from = getCoords(event);
            vm.drawing = true;

            if (vm.state.drawingPlayer.id === vm.player.id) {
                vm.coords.to = { x: vm.coords.from.x - 1, y: vm.coords.from.y - 1 };
                sendClientEvent(vm.drawSettings.currentTool, vm.coords);
            }
        }

        function onMouseUp(event) {
            vm.drawing = false;
        }

        function onMouseMove(event) {
            if (vm.drawing && vm.state.drawingPlayer.id === vm.player.id) {
                vm.coords.to = getCoords(event);
                sendClientEvent(vm.drawSettings.currentTool, vm.coords);

                vm.coords.from = vm.coords.to;
            }
        }

        function onMouseLeave(event) {
            vm.drawing = false;
        }

        function onResize(event) {
            console.log('onResize: ', event);
        }

        function onInputKey(event) {

            switch (event.keyCode) {
                // Enter key
                case 13: {
                    addMessage();
                    break;
                }
                // Arrow up
                case 38: {
                    vm.newMessage = vm.myMessages[vm.myMessages.length - 1];
                    break;
                }

                // | - Toggle guess mode
                case 220: {
                    console.log(vm.newMessage);
                    vm.newMessage = vm.newMessage.replace('|', '');
                    setInputGuessMode(!vm.inputGuessMode);
                    // vm.newMessage = vm.newMessage.substr(0, vm.newMessage.length - 1);
                    break;
                }
            }

            if (vm.inputGuessMode && vm.newMessage.substr(0, 1) !== '!') {
                vm.newMessage = '!' + vm.newMessage;
            }
        }

        function setInputGuessMode(value) {
            vm.inputGuessMode = value;

            var firstChar = vm.newMessage.substr(0, 1);
            if (!vm.inputGuessMode && firstChar === '!') {
                vm.newMessage = vm.newMessage.substr(1, vm.newMessage.length);
            }

            if (vm.inputGuessMode && firstChar !== '!') {
                vm.newMessage = '!' + vm.newMessage;
            }
        }

        function toggleSoundSettings(setting) {
            console.log('toggleSoundSettings: ' + setting);
            vm.soundSettings[setting] = !vm.soundSettings[setting];
        }

        function addMessage() {

            vm.myMessages.push(vm.newMessage);

            // Drawing player cannot use chat
            if (vm.player.id === vm.state.drawingPlayer.id) {
                alert.show('warning', 'Permission denied', 'Drawing player can not use chat.');
                vm.newMessage = '';
                return;
            }

            var eventType = 'addMessage';
            var eventValue = {
                timestamp: new Date(),
                type: 'chat',
                from: vm.player.name,
                message: vm.newMessage
            };

            if (vm.newMessage.charAt(0) === '!') {
                eventType = 'guessWord';
                eventValue.type = 'guess-word';
                eventValue.message = vm.newMessage.substr(1);
            }

            sendClientEvent(eventType, eventValue);

            vm.newMessage = '';
        }

        function sendClientEvent(type, value) {
            sawkit.emit('clientEvent', {
                player: vm.player,
                type: type,
                value: value
            });

            if (type !== 'brush') {
                console.log(
                    '\n*** sendClientEvent:' +
                    ' player = ' + vm.player.email + '(' + vm.player.id + ')' +
                    ', type = ' + type +
                    ', value = ' + value);
            }
        }

        /**
         * Server events
         */
        sawkit.on('serverEvent', function (serverEvent) {

            var serverEvents = serverEvents || {};

            serverEvents.updateState = function (serverEvent) {

                angular.extend(vm.state, serverEvent.value);

                var updatedPlayer;
                for (var i = 0; i < vm.state.players.length; i++) {
                    if (vm.state.players[i].email === vm.player.email) {
                        updatedPlayer = vm.state.players[i];
                    }
                }
                angular.extend(vm.player, updatedPlayer);
            };

            serverEvents.updateDrawSettings = function (serverEvent) {
                angular.extend(vm.drawSettings, serverEvent.value);
            };

            serverEvents.updateTimer = function (serverEvent) {
                vm.state.timer = serverEvent.value;
            };

            // TODO: sjekk hva som overføres av data her...vil ha minst mulig
            serverEvents.brush = function (serverEvent) {
                var coords = serverEvent.value;

                vm.ctx.beginPath();

                vm.ctx.strokeStyle = vm.drawSettings.strokeStyle;
                vm.ctx.lineWidth = vm.drawSettings.lineWidth;
                vm.ctx.lineJoin = vm.drawSettings.lineJoin;
                vm.ctx.lineCap = vm.drawSettings.lineCap;

                vm.ctx.moveTo(coords.from.x, coords.from.y);
                vm.ctx.lineTo(coords.to.x, coords.to.y);
                vm.ctx.stroke();
            };

            serverEvents.clear = function (serverEvent) {
                vm.ctx.clearRect(0, 0, vm.canvas.width, vm.canvas.height);
            };

            serverEvents.playSound = function (serverEvent) {
                if (!vm.soundSettings.muteSfx) {
                    sfx[serverEvent.value].play();
                }
            };

            serverEvents.addMessage = function (serverEvent) {
                vm.chatMessages.push(serverEvent.value);

                var message = serverEvent.value;
                if (message.type === 'important') {
                    alert.show('info', '', serverEvent.value.message);
                }
            };

            serverEvents.serverError = function (serverEvent) {
                vm.chatMessages.push({
                    timestamp: new Date(),
                    type: 'danger',
                    message: serverEvent.value
                });
                alert.show('warning', serverEvent.type, serverEvent.value);
                console.log('Server Error: ', serverEvent.value);
            };

            serverEvents.default = function (serverEvent) {
                alert.show('warning', 'Client Error', 'No handler found for type: ' + serverEvent.type);
                console.log('Client Error - No handler found for type: ' + serverEvent.type);
            };

            if (serverEvents[serverEvent.type]) {
                return serverEvents[serverEvent.type](serverEvent);
            } else {
                return serverEvents.default(serverEvent);
            }
        });

        /**
         * Private functions
         */
        function getCoords(event) {
            var coords = {
                x: 0,
                y: 0
            };

            if (event.offsetX !== undefined) {
                coords.x = event.offsetX;
                coords.y = event.offsetY;
            } else {
                // Firefox compatibility
                coords.x = event.layerX - event.currentTarget.offsetLeft;
                coords.y = event.layerY - event.currentTarget.offsetTop;
            }

            return coords;
        }

    }
})();
