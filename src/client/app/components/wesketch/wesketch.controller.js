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
        vm.players = [];
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
        vm.addChatMessage = addChatMessage;
        vm.init = init;

        init();

        function init() {
            vm.player.name = tokenIdentity.currentUser.name;

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
                sawkit.emit('clientEvent', {
                    type: vm.settings.currentTool,
                    value: vm.coords
                });

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
                type: type,
                value: value
            });
        }

        function addChatMessage(message) {
            vm.newMessage = '';
            var chatMessage = {
                timestamp: new Date(),
                type: 'chat',
                from: vm.player.name,
                message: message
            };
            sawkit.emit('clientEvent', {
                type: 'addChatMessage',
                value: chatMessage
            });
        }

        /**
         * Server events
         */
        sawkit.on('serverEvent', function (serverEvent) {

            var gameEvent = gameEvent || {};

            gameEvent.updateSettings = function (serverEvent) {
                angular.extend(vm.settings, serverEvent.value);
            };

            gameEvent.brush = function (serverEvent) {
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

            gameEvent.clear = function (serverEvent) {
                vm.ctx.clearRect(0, 0, vm.canvas.width, vm.canvas.height);
            };

            gameEvent.clientConnected = function (serverEvent) {
                sendClientEvent('addPlayer', {
                    id: serverEvent.value,
                    name: vm.player.name
                });
            };

            gameEvent.clientDisconnected = function (serverEvent) {
                sendClientEvent('removePlayer', {
                    id: serverEvent.value,
                    name: vm.player.name
                });
            };

            gameEvent.updatePlayers = function (serverEvent) {
                vm.players = serverEvent.value;
            };

            gameEvent.addChatMessage = function (serverEvent) {
                vm.chatMessages.push(serverEvent.value);

                // TODO: fix better plz
                // http://stackoverflow.com/questions/26343832/scroll-to-bottom-in-chat-box-in-angularjs

                vm.messagesElement.scrollTop = vm.messagesElement.scrollHeight;

                console.log('vm.messagesElement.scrollTop: ' + vm.messagesElement.scrollTop);
                console.log('vm.messagesElement.scrollHeight: ' + vm.messagesElement.scrollHeight);
            };

            gameEvent.serverError = function (serverEvent) {
                vm.chatMessages.push({
                    timestamp: new Date(),
                    type: 'danger',
                    message: serverEvent.value
                });
                alert.show('warning', serverEvent.type, serverEvent.value);
                console.log('server-error: ', serverEvent.value);
            };

            gameEvent.default = function (serverEvent) {
                alert.show('warning', 'Error', 'No handler found for type: ' + serverEvent.type);
                console.log('No handler found for type: ' + serverEvent.type);
            };

            if (gameEvent[serverEvent.type]) {
                return gameEvent[serverEvent.type](serverEvent);
            } else {
                return gameEvent.default(serverEvent);
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
