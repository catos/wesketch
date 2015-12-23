/* global Howl */
(function () {
    'use strict';

    angular
        .module('components.wesketch')
        .controller('WesketchController', WesketchController);

    WesketchController.$inject = ['$filter', '$uibModal', 'alert', 'tokenIdentity', 'wesketchClientModel', 'wesketchClientSocket'];

    function WesketchController($filter, $uibModal, alert, tokenIdentity, wesketchClientModel, wesketchClientSocket) {
        var vm = this;

        vm.client = wesketchClientModel;

        /**
         * Client events
         */
        // TODO: dette må skilles ut...
        vm.clientEvent = function(event) {
            var clientEvents = clientEvents || {};

            clientEvents.toggleSoundSettings = function (event) {
                var setting = event.value;
                vm.client.soundSettings[setting] = !vm.client.soundSettings[setting];
            };

            clientEvents.setInputGuessMode = function (event) {
                vm.client.chat.guessMode = event.value;

                var firstChar = vm.client.chat.input.substr(0, 1);
                if (!vm.client.chat.guessMode && firstChar === '!') {
                    vm.client.chat.input = vm.client.chat.input.substr(1, vm.client.chat.input.length);
                }

                if (vm.client.chat.guessMode && firstChar !== '!') {
                    vm.client.chat.input = '!' + vm.client.chat.input;
                }
            };

            clientEvents.addMessage = function (event) {

                // Empty messages are not allowed
                if (!vm.client.chat.input || vm.client.chat.input === '!') {
                    return;
                }

                // Add message to personaly history
                vm.client.chat.myMessages.push(vm.client.chat.input);

                // Drawing player cannot use chat
                if (vm.client.drawingPlayer !== undefined && vm.client.player.id === vm.client.drawingPlayer.id) {
                    alert.show('warning', 'Permission denied', 'Drawing player can not use chat.');
                    vm.client.chat.input = '';
                    return;
                }

                var eventType = 'addMessage';
                var eventValue = {
                    timestamp: new Date(),
                    type: 'chat',
                    from: vm.client.player.name,
                    message: vm.client.chat.input
                };

                if (vm.client.chat.input.charAt(0) === '!') {
                    eventType = 'guessWord';
                    eventValue.type = 'guess-word';
                    eventValue.message = vm.client.chat.input.substr(1);
                }

                wesketchClientSocket.emit(vm.client.player, eventType, eventValue);

                vm.client.chat.input = '';

            };

            clientEvents.onInputKey = function (event) {
                switch (event.value.keyCode) {
                    // Enter key
                    case 13: {
                        vm.clientEvent({
                            type: 'addMessage'
                        });
                        break;
                    }
                    // Arrow up
                    case 38: {
                        vm.client.chat.input = vm.client.chat.myMessages[vm.client.chat.myMessages.length - 1];
                        break;
                    }

                    // | - Toggle guess mode
                    case 220: {
                        vm.client.chat.input = vm.client.chat.input.replace('|', '');
                        vm.clientEvent({
                            type: 'setInputGuessMode',
                            value: !vm.client.chat.guessMode
                        });
                        break;
                    }
                }

                if (vm.client.chat.guessMode && vm.client.chat.input.substr(0, 1) !== '!') {
                    vm.client.chat.input = '!' + vm.client.chat.input;
                }
            };

            clientEvents.default = function (event) {
                wesketchClientSocket.emit(vm.client.player, event.type, event.value);
            };

            if (clientEvents[event.type]) {
                return clientEvents[event.type](event);
            } else {
                return clientEvents.default(event);
            }
        };

        init();

        function init() {
            wesketchClientSocket.init();

            // TODO: dette er vel ikke helt spa, hva med å sende med som
            // parameter fra directive, eller bruke angular.element ?
            vm.client.canvas = document.getElementById('canvas');
            if (vm.client.canvas !== undefined) {
                vm.client.canvas.onmousedown = onMouseDown;
                vm.client.canvas.onmouseup = onMouseUp;
                vm.client.canvas.onmousemove = onMouseMove;
                vm.client.canvas.onmouseleave = onMouseLeave;
                vm.client.ctx = vm.client.canvas.getContext('2d');
            }

            // Add player to the game
            vm.client.player.id = -1;
            vm.client.player.email = tokenIdentity.currentUser.email;
            vm.client.player.name = tokenIdentity.currentUser.name;
            vm.clientEvent({ type: 'addPlayer', value: vm.client.player });

            vm.client.isAdmin = tokenIdentity.isAdmin();

            prepareSounds(function () {
                console.log('Finished preparing sounds.');
            });
        }

        function prepareSounds(next) {

            vm.client.sounds.playerJoined = addSfx('SUCCESS TUNE Happy Sticks Short 01.wav');
            vm.client.sounds.playerReady = addSfx('TECH INTERFACE Computer Beeps 08.wav');
            vm.client.sounds.playerRightAnswer = addSfx('SUCCESS PICKUP Collect Beep 02.wav');
            vm.client.sounds.endRoundNoCorrect = addSfx('SUCCESS TUNE Win Ending 09.wav');
            vm.client.sounds.timerTension = addSfx('Time Strain.wav');
            vm.client.sounds.endGame = addSfx('SUCCESS TUNE Win Complete 07.wav');

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

        // TODO: all onXXX-methods are belong to vm.clientEvent
        function onMouseDown(event) {
            vm.client.coords.from = getCoords(event);
            vm.client.isDrawing = true;

            if (vm.client.drawingPlayer !== undefined && vm.client.drawingPlayer.id === vm.client.player.id) {
                vm.client.coords.to = { x: vm.client.coords.from.x - 1, y: vm.client.coords.from.y - 1 };
                vm.clientEvent({
                    type: vm.client.drawSettings.currentTool,
                    value: vm.client.coords
                });
            }
        }

        function onMouseUp(event) {
            vm.client.isDrawing = false;
        }

        function onMouseMove(event) {
            if (vm.client.isDrawing && vm.client.drawingPlayer !== undefined && vm.client.drawingPlayer.id === vm.client.player.id) {
                vm.client.coords.to = getCoords(event);
                vm.clientEvent({
                    type: vm.client.drawSettings.currentTool,
                    value: vm.client.coords
                });

                vm.client.coords.from = vm.client.coords.to;
            }
        }

        function onMouseLeave(event) {
            vm.client.isDrawing = false;
        }

        function onResize(event) {
            console.log('onResize: ', event);
        }

        /**
         * Server events
         */
        // sawkit.on('serverEvent', function (serverEvent) {
        wesketchClientSocket.onServerEvent(function (serverEvent) {

            var serverEvents = serverEvents || {};

            serverEvents.updateState = function (serverEvent) {
                // Update state
                angular.extend(vm.client.state, serverEvent.value);

                // Reassign drawing player
                vm.client.drawingPlayer = $filter('filter')(vm.client.state.players, { isDrawing: true }, true)[0];

                // Update player
                var player = $filter('filter')(vm.client.state.players, { email: vm.client.player.email }, true)[0];
                angular.extend(vm.client.player, player);
            };

            serverEvents.updateDrawSettings = function (serverEvent) {
                angular.extend(vm.client.drawSettings, serverEvent.value);
            };

            serverEvents.updateTimer = function (serverEvent) {
                vm.client.state.timer = serverEvent.value;
            };

            serverEvents.brush = function (serverEvent) {
                var coords = serverEvent.value;

                vm.client.ctx.beginPath();

                vm.client.ctx.strokeStyle = vm.client.drawSettings.strokeStyle;
                vm.client.ctx.lineWidth = vm.client.drawSettings.lineWidth;
                vm.client.ctx.lineJoin = vm.client.drawSettings.lineJoin;
                vm.client.ctx.lineCap = vm.client.drawSettings.lineCap;

                vm.client.ctx.moveTo(coords.from.x, coords.from.y);
                vm.client.ctx.lineTo(coords.to.x, coords.to.y);
                vm.client.ctx.stroke();
            };

            serverEvents.clear = function (serverEvent) {
                vm.client.ctx.clearRect(0, 0, vm.client.canvas.width, vm.client.canvas.height);
            };

            serverEvents.playSound = function (serverEvent) {
                if (!vm.client.soundSettings.muteSfx) {
                    vm.client.sounds[serverEvent.value].play();
                }
            };

            serverEvents.stopSound = function (serverEvent) {
                vm.client.sounds[serverEvent.value].stop();
            };

            serverEvents.addMessage = function (serverEvent) {
                vm.client.chat.messages.push(serverEvent.value);

                var message = serverEvent.value;
                if (message.type === 'important') {
                    alert.show('info', '', serverEvent.value.message);
                }
            };

            serverEvents.showScores = function (serverEvent) {
                $uibModal.open({
                    // templateUrl: 'app/components/wesketch/wesketch.scores.html',
                    template: '<div class="wesketch-scores"><div class="modal-header"><h3 class="modal-title">Scoreboard!</h3></div><div class="modal-body"><table class="table table-bordered table-striped"><tr><th>Player</th><th>Score</th></tr><tr ng-repeat="player in vm.client.players"><td>{{player.name}}</td><td>{{player.score}}</td></tr></table></div><div class="modal-footer"><button class="btn btn-primary" type="button" ng-click="vm.client.close()">Close</button></div></div>',
                    controller: 'WesketchScoresController',
                    controllerAs: 'vm',
                    resolve: {
                        players: function () {
                            return vm.client.state.players;
                        }
                    }
                });
            };

            serverEvents.setInputGuessMode = function (serverEvent) {
                console.log('serverEvent.value: ' + serverEvent.value);
                vm.clientEvent({
                    type: 'setInputGuessMode',
                    value: serverEvent.value
                });
            };

            serverEvents.serverError = function (serverEvent) {
                vm.client.client.chat.messages.push({
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
