(function () {
    'use strict';

    angular
        .module('components.wesketch')
        .controller('WesketchController', WesketchController);

    WesketchController.$inject = ['lodash', 'alert', 'sawkit', 'tokenIdentity'];

    function WesketchController(lodash, alert, sawkit, tokenIdentity) {
        /**
         * Private variables
         */
        var tools = ['brush', 'eraser', 'fill'];
        var colors = ['#000', '#fff', '#ccc', '#ace'];

        /**
         * Viewmodel
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

        vm.player = {};
        // vm.players = [];

        vm.state = {};
        vm.chatMessages = [];
        vm.newMessage = '';
        vm.settings = {
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

        vm.sendClientEvent = sendClientEvent;
        vm.addMessage = addMessage;

        init();

        function init() {
            sawkit.connect('weesketch');

            // TODO: dette er vel ikke helt spa, hva med å sende med som
            // parameter fra directive, eller bruke angular.element ?
            vm.canvas = document.getElementById('canvas');
            vm.messagesElement = document.getElementById('messages');
            if (vm.canvas !== undefined) {

                // TODO: resize canvas
                // vm.canvas.onresize = onResize;
                // var w = angular.element($window);
                // w.bind('resize', function () {
                //     console.log('resize!');

                //     var rowElement = document.getElementById('canvas-height');
                //     console.log('rowElement.clientHeight: ' + rowElement.offsetHeight);
                //     vm.canvas.style.width = '100%';
                //     vm.canvas.style.height = rowElement.offsetHeight + 'px';
                //     vm.canvas.width = vm.canvas.offsetWidth;
                //     vm.canvas.height = vm.canvas.offsetHeight;
                // });

                vm.canvas.onmousedown = onMouseDown;
                vm.canvas.onmouseup = onMouseUp;
                vm.canvas.onmousemove = onMouseMove;
                vm.canvas.onmouseleave = onMouseLeave;
                vm.ctx = vm.canvas.getContext('2d');
            }

            sendClientEvent('updateState')
        }

        /**
         * Client events
         */
        function onMouseDown(event) {
            vm.coords.from = getCoords(event);
            vm.drawing = true;
        }

        function onMouseUp(event) {
            vm.drawing = false;
        }

        function onMouseMove(event) {
            if (vm.drawing) {
                vm.coords.to = getCoords(event);
                sendClientEvent(vm.settings.currentTool, vm.coords);

                vm.coords.from = vm.coords.to;
            }
        }

        function onMouseLeave(event) {
            vm.drawing = false;
        }

        function onResize(event) {
            console.log('onResize: ', event);
        }

        function sendClientEvent(type, value) {
            sawkit.emit('clientEvent', {
                client: vm.player,
                type: type,
                value: value
            });
        }

        function addMessage() {

            // Drawing player cannot use chat
            if (vm.player.id === vm.state.drawingPlayer.id) {
                alert.show('warning', 'Permission denied', 'Drawing player can not use chat.');
                vm.newMessage = '';
                return;
            }

            var eventType = 'guessWord';
            var eventValue = {
                timestamp: new Date(),
                type: 'guess-word',
                from: vm.player.name,
                message: vm.newMessage
            };

            if (vm.newMessage.charAt(0) === '!') {
                eventType = 'addMessage';
                eventValue.type = 'chat';
                eventValue.message = vm.newMessage.substr(1);
            }

            sendClientEvent(eventType, eventValue);

            vm.newMessage = '';
        }

        /**
         * Server events
         */
        sawkit.on('serverEvent', function (serverEvent) {

            var serverEvents = serverEvents || {};

            serverEvents.clientConnected = function (serverEvent) {
                vm.player = {
                    id: serverEvent.value,
                    name: tokenIdentity.currentUser.name
                };
                vm.sendClientEvent('addPlayer');
            };

            serverEvents.clientDisconnected = function (serverEvent) {
                vm.sendClientEvent('removePlayer', {
                    id: serverEvent.value,
                    name: vm.player.name
                });
            };

            serverEvents.updateState = function (serverEvent) {
                angular.extend(vm.state, serverEvent.value);
                vm.player = lodash.find(vm.state.players, { id: vm.player.id });
            };

            serverEvents.updateSettings = function (serverEvent) {
                angular.extend(vm.settings, serverEvent.value);
            };

            serverEvents.brush = function (serverEvent) {
                var coords = serverEvent.value;

                vm.ctx.beginPath();

                vm.ctx.strokeStyle = vm.settings.strokeStyle;
                vm.ctx.lineWidth = vm.settings.lineWidth;
                vm.ctx.lineJoin = vm.settings.lineJoin;
                vm.ctx.lineCap = vm.settings.lineCap;

                vm.ctx.moveTo(coords.from.x, coords.from.y);
                vm.ctx.lineTo(coords.to.x, coords.to.y);
                vm.ctx.stroke();
            };

            serverEvents.clear = function (serverEvent) {
                vm.ctx.clearRect(0, 0, vm.canvas.width, vm.canvas.height);
            };

            serverEvents.updatePlayers = function (serverEvent) {
                vm.players = serverEvent.value;
            };

            serverEvents.addMessage = function (serverEvent) {
                vm.chatMessages.push(serverEvent.value);

                // TODO: fix better plz
                // http://stackoverflow.com/questions/26343832/scroll-to-bottom-in-chat-box-in-angularjs

                vm.messagesElement.scrollTop = vm.messagesElement.scrollHeight;

                console.log('vm.messagesElement.scrollTop: ' + vm.messagesElement.scrollTop);
                console.log('vm.messagesElement.scrollHeight: ' + vm.messagesElement.scrollHeight);
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
