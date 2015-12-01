(function () {
    'use strict';

    angular
        .module('components.csadraw')
        .controller('CsadrawController', CsadrawController);

    CsadrawController.$inject = ['alert', 'sawkit', 'tokenIdentity'];

    function CsadrawController(alert, sawkit, tokenIdentity) {
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

        vm.clientMessage = clientMessage;
        vm.chatMessage = chatMessage;
        vm.init = init;

        init();

        function init() {
            sawkit.connect('weesketch');

            vm.canvas = document.getElementById('canvas');
            if (vm.canvas !== undefined) {
                vm.canvas.onresize = onResize;

                vm.canvas.onmousedown = onMouseDown;
                vm.canvas.onmouseup = onMouseUp;
                vm.canvas.onmousemove = onMouseMove;
                vm.canvas.onmouseleave = onMouseLeave;
                vm.ctx = vm.canvas.getContext('2d');
            }
        }

        /**
         * Socket listener
         */
        sawkit.on('message', function (message) {
            switch (message.type) {
                case 'update-settings': {
                    angular.extend(vm.settings, message.value);
                    break;
                }
                case 'clear': {
                    vm.ctx.clearRect(0, 0, vm.canvas.width, vm.canvas.height);
                    break;
                }
                case 'brush': {
                    var coords = message.value;
                    brush(coords);
                    break;
                }
                case 'client-connected': {
                    clientMessage('add-player', {
                        id: message.value,
                        name: tokenIdentity.currentUser.name
                    });
                    break;
                }
                case 'client-disconnected': {
                    clientMessage('remove-player', {
                        id: message.value,
                        name: tokenIdentity.currentUser.name
                    });
                    break;
                }
                case 'update-players': {
                    vm.players = message.value;
                    break;
                }
                case 'chat-message': {
                    vm.chatMessages.push(message.value);
                    break;
                }
                case 'server-error': {
                    vm.chatMessages.push({
                        timestamp: new Date(),
                        type: 'danger',
                        message: message.value
                    });
                    alert.show('warning', message.type, message.value);
                    console.log('server-error: ', message.value);
                    break;
                }
                default: {
                    alert.show('warning', 'Error', 'No handler found for type: ' + message.type);
                    console.log('No handler found for type: ' + message.type);
                    return;
                }
            }
        });

        /**
         * Events
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

        function clientMessage(type, value) {
            sawkit.emit('message', {
                type: type,
                value: value
            });
        }

        function chatMessage(message) {
            vm.newMessage = '';
            var chatMessage = {
                timestamp: new Date(),
                type: 'chat',
                from: tokenIdentity.currentUser.name,
                message: message
            };
            sawkit.emit('message', {
                type: 'chat-message',
                value: chatMessage
            });
        }

        /**
         * Private functions
         */
        function brush(coords) {
            vm.ctx.beginPath();

            // Settings
            vm.ctx.strokeStyle = vm.settings.strokeStyle;
            vm.ctx.lineWidth = vm.settings.lineWidth;
            vm.ctx.lineJoin = vm.settings.lineJoin;
            vm.ctx.lineCap = vm.settings.lineCap;

            vm.ctx.moveTo(coords.from.x, coords.from.y);
            vm.ctx.lineTo(coords.to.x, coords.to.y);
            vm.ctx.stroke();
        }

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
