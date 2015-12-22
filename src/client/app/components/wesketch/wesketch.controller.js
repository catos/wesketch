/* global Howl */
(function () {
    'use strict';

    angular
        .module('components.wesketch')
        .controller('WesketchController', WesketchController);

    WesketchController.$inject = ['$filter', '$uibModal', 'alert', 'sawkit', 'tokenIdentity'];

    function WesketchController($filter, $uibModal, alert, sawkit, tokenIdentity) {
        /**
         * Private variables
         */
        var tools = ['brush', 'eraser', 'fill'];
        var colors = [
            '#000000', '#c0c0c0', '#ffffff',
            '#2c4fa5', '#007cc9', '#00acf3',
            '#00a446', '#5bb339', '#95c51f',
            '#f1b700', '#fbdd00', '#fff200',
            '#d9242a', '#de5b1f', '#e58100',
            '#c50c70', '#d9058f', '#e486b9',
            '#6c4b1f', '#a98754', '#c2ac79'
        ];
        var sfx = {};

        /**
         * Viewmodel variables
         */
        var vm = this;
        vm.ctx = null;
        vm.canvas = null;
        vm.isDrawing = false;
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
        vm.drawingPlayer = {};

        vm.state = {};

        vm.chat = {
            input: '',
            messages: [],
            myMessages: [],
            guessMode: false,
        };

        vm.soundSettings = {
            muteSfx: false,
            muteMusic: false
        };

        vm.drawSettings = {
            lineWidth: 2,
            lineJoin: 'round', // 'butt', 'round', 'square'
            lineCap: 'round', // 'bevel', 'round', 'miter',

            tools: tools,
            colors: colors,

            currentTool: tools[0],
            strokeStyle: colors[0],
        };

        /**
         * Viewmodel functions
         */
        vm.sendClientEvent = sendClientEvent;

        // vm.toggleSoundSettings = toggleSoundSettings;
        // vm.setInputGuessMode = setInputGuessMode;
        vm.addMessage = addMessage;
        vm.onInputKey = onInputKey;

        // TODO: TEST

        vm.clientEvent = function (event) {
            var clientEvents = clientEvents || {};

            vm.clientEvents.toggleSoundSettings = function (event) {
                var setting = event.value;
                vm.soundSettings[setting] = !vm.soundSettings[setting];
                console.log('vm.soundSettings: ', vm.soundSettings);
            };

            vm.clientEvents.setInputGuessMode = function (value) {
                vm.chat.guessMode = value;

                var firstChar = vm.chat.input.substr(0, 1);
                if (!vm.chat.guessMode && firstChar === '!') {
                    vm.chat.input = vm.chat.input.substr(1, vm.chat.input.length);
                }

                if (vm.chat.guessMode && firstChar !== '!') {
                    vm.chat.input = '!' + vm.chat.input;
                }
            };

            clientEvents.default = function (event) {
                alert.show('warning', 'clientEvents Error', 'No clientEvent found for type: ' + event.type);
                console.log('clientEvents Error - No clientEvent found for type: ' + event.type);
            };

            if (clientEvents[event.type]) {
                return clientEvents[event.type](event);
            } else {
                return clientEvents.default(event);
            }
        }

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
            sfx.playerRightAnswer = addSfx('SUCCESS PICKUP Collect Beep 02.wav');
            sfx.endRoundNoCorrect = addSfx('SUCCESS TUNE Win Ending 09.wav');
            sfx.timerTension = addSfx('Time Strain.wav');
            sfx.endGame = addSfx('SUCCESS TUNE Win Complete 07.wav');

            next();

            function addSfx(path) {
                var defaults = {
                    buffer: true,
                    urls: [''],
                    volume: 0.1
                };
                return new Howl(angular.extend({}, defaults, { urls: ['/sounds/' + path] }));
            }
        }

        /**
         * Client events
         */
        function onMouseDown(event) {
            vm.coords.from = getCoords(event);
            vm.isDrawing = true;

            if (vm.drawingPlayer !== undefined && vm.drawingPlayer.id === vm.player.id) {
                vm.coords.to = { x: vm.coords.from.x - 1, y: vm.coords.from.y - 1 };
                sendClientEvent(vm.drawSettings.currentTool, vm.coords);
            }
        }

        function onMouseUp(event) {
            vm.isDrawing = false;
        }

        function onMouseMove(event) {
            if (vm.isDrawing && vm.drawingPlayer !== undefined && vm.drawingPlayer.id === vm.player.id) {
                vm.coords.to = getCoords(event);
                sendClientEvent(vm.drawSettings.currentTool, vm.coords);

                vm.coords.from = vm.coords.to;
            }
        }

        function onMouseLeave(event) {
            vm.isDrawing = false;
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
                    vm.chat.input = vm.chat.myMessages[vm.chat.myMessages.length - 1];
                    break;
                }

                // | - Toggle guess mode
                case 220: {
                    vm.chat.input = vm.chat.input.replace('|', '');
                    vm.clientEvents.setInputGuessMode(!vm.chat.guessMode);
                    // vm.chat.input = vm.chat.input.substr(0, vm.chat.input.length - 1);
                    break;
                }
            }

            if (vm.chat.guessMode && vm.chat.input.substr(0, 1) !== '!') {
                vm.chat.input = '!' + vm.chat.input;
            }
        }

        // function setInputGuessMode(value) {
        //     vm.chat.guessMode = value;

        //     var firstChar = vm.chat.input.substr(0, 1);
        //     if (!vm.chat.guessMode && firstChar === '!') {
        //         vm.chat.input = vm.chat.input.substr(1, vm.chat.input.length);
        //     }

        //     if (vm.chat.guessMode && firstChar !== '!') {
        //         vm.chat.input = '!' + vm.chat.input;
        //     }
        // }

        // function toggleSoundSettings(setting) {
        //     console.log('toggleSoundSettings: ' + setting);
        //     vm.soundSettings[setting] = !vm.soundSettings[setting];
        // }

        function addMessage() {

            // Empty messages are not allowed
            if (!vm.chat.input || vm.chat.input === '!') {
                return;
            }

            // Add message to personaly history
            vm.chat.myMessages.push(vm.chat.input);

            // Drawing player cannot use chat
            if (vm.drawingPlayer !== undefined && vm.player.id === vm.drawingPlayer.id) {
                alert.show('warning', 'Permission denied', 'Drawing player can not use chat.');
                vm.chat.input = '';
                return;
            }

            var eventType = 'addMessage';
            var eventValue = {
                timestamp: new Date(),
                type: 'chat',
                from: vm.player.name,
                message: vm.chat.input
            };

            if (vm.chat.input.charAt(0) === '!') {
                eventType = 'guessWord';
                eventValue.type = 'guess-word';
                eventValue.message = vm.chat.input.substr(1);
            }

            sendClientEvent(eventType, eventValue);

            vm.chat.input = '';
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
                // Update state
                angular.extend(vm.state, serverEvent.value);

                // Reassign drawing player
                vm.drawingPlayer = $filter('filter')(vm.state.players, { isDrawing: true }, true)[0];

                // Update player
                var player = $filter('filter')(vm.state.players, { email: vm.player.email }, true)[0];
                angular.extend(vm.player, player);
            };

            serverEvents.updateDrawSettings = function (serverEvent) {
                angular.extend(vm.drawSettings, serverEvent.value);
            };

            serverEvents.updateTimer = function (serverEvent) {
                vm.state.timer = serverEvent.value;
            };

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

            serverEvents.stopSound = function (serverEvent) {
                sfx[serverEvent.value].stop();
            };

            serverEvents.addMessage = function (serverEvent) {
                vm.chat.messages.push(serverEvent.value);

                var message = serverEvent.value;
                if (message.type === 'important') {
                    alert.show('info', '', serverEvent.value.message);
                }
            };

            serverEvents.showScores = function (serverEvent) {
                $uibModal.open({
                    // templateUrl: 'app/components/wesketch/wesketch.scores.html',
                    template: '<div class="wesketch-scores"><div class="modal-header"><h3 class="modal-title">Scoreboard!</h3></div><div class="modal-body"><table class="table table-bordered table-striped"><tr><th>Player</th><th>Score</th></tr><tr ng-repeat="player in vm.players"><td>{{player.name}}</td><td>{{player.score}}</td></tr></table></div><div class="modal-footer"><button class="btn btn-primary" type="button" ng-click="vm.close()">Close</button></div></div>',
                    controller: 'WesketchScoresController',
                    controllerAs: 'vm',
                    resolve: {
                        players: function () {
                            return vm.state.players;
                        }
                    }
                });
            };

            serverEvents.setInputGuessMode = function (serverEvent) {
                vm.clientEvents.setInputGuessMode(serverEvent.value);
            };

            serverEvents.serverError = function (serverEvent) {
                vm.chat.messages.push({
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
