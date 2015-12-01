(function () {
    'use strict';

    angular
        .module('components.wesketch')
        .controller('WesketchController', WesketchController);

    WesketchController.$inject = ['$window', 'alert', 'sawkit', 'tokenIdentity'];

    function WesketchController($window, alert, sawkit, tokenIdentity) {
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

        vm.clientMessage = clientMessage;
        vm.chatMessage = chatMessage;
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
         * Messages from the server
         */
        sawkit.on('message', function (message) {

            var serverMessage = serverMessage || {};

            serverMessage.updateSettings = function (message) {
                angular.extend(vm.settings, message.value);
            };

            serverMessage.brush = function (message) {
                var coords = message.value;

                vm.ctx.beginPath();

                vm.ctx.strokeStyle = vm.settings.strokeStyle;
                vm.ctx.lineWidth = vm.settings.lineWidth;
                vm.ctx.lineJoin = vm.settings.lineJoin;
                vm.ctx.lineCap = vm.settings.lineCap;

                vm.ctx.moveTo(coords.from.x, coords.from.y);
                vm.ctx.lineTo(coords.to.x, coords.to.y);
                vm.ctx.stroke();
            };

            serverMessage.clear = function (message) {
                vm.ctx.clearRect(0, 0, vm.canvas.width, vm.canvas.height);
            };

            serverMessage.clientConnected = function (message) {
                clientMessage('addPlayer', {
                    id: message.value,
                    name: vm.player.name
                });
            };

            serverMessage.clientDisconnected = function (message) {
                clientMessage('removePlayer', {
                    id: message.value,
                    name: vm.player.name
                });
            };

            serverMessage.updatePlayers = function (message) {
                vm.players = message.value;
            };

            serverMessage.chatMessage = function (message) {
                vm.chatMessages.push(message.value);
                
                // TODO: fix better plz
                // http://stackoverflow.com/questions/26343832/scroll-to-bottom-in-chat-box-in-angularjs
                
                vm.messagesElement.scrollTop = vm.messagesElement.scrollHeight;
                
                console.log('vm.messagesElement.scrollTop: ' + vm.messagesElement.scrollTop);
                console.log('vm.messagesElement.scrollHeight: ' + vm.messagesElement.scrollHeight);
            };

            serverMessage.serverError = function (message) {
                vm.chatMessages.push({
                    timestamp: new Date(),
                    type: 'danger',
                    message: message.value
                });
                alert.show('warning', message.type, message.value);
                console.log('server-error: ', message.value);
            };

            serverMessage.default = function (message) {
                alert.show('warning', 'Error', 'No handler found for type: ' + message.type);
                console.log('No handler found for type: ' + message.type);
            };

            if (serverMessage[message.type]) {
                return serverMessage[message.type](message);
            } else {
                return serverMessage.default(message);
            }
        });

        /**
         * Mouse & Resize events
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
                sawkit.emit('message', {
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


        /**
         * Events called from the UI-elements
         */

        function clientMessage(type, value) {
            sawkit.emit('message', {
                type: type,
                value: value
            });
        }

        // TODO: rename message til event || data || clientEvent || gameEvent
        function chatMessage(message) {
            vm.newMessage = '';
            var chatMessage = {
                timestamp: new Date(),
                type: 'chat',
                from: tokenIdentity.currentUser.name,
                message: message
            };
            sawkit.emit('message', {
                type: 'chatMessage',
                value: chatMessage
            });
        }

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
