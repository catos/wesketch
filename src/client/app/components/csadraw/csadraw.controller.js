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
        vm.init = init;

        init();

        function init() {
            sawkit.connect('chat');
            vm.canvas = document.getElementById('canvas');

            if (vm.canvas !== undefined) {
                vm.canvas.onmousedown = onMouseDown;
                vm.canvas.onmouseup = onMouseUp;
                vm.canvas.onmousemove = onMouseMove;
                vm.canvas.onmouseleave = onMouseLeave;
                vm.ctx = vm.canvas.getContext('2d');
            }

            clientMessage('player-joined', { name: tokenIdentity.currentUser.name });
        }

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
                    coords: vm.coords
                });

                vm.coords.from = vm.coords.to;
            }
        }

        function onMouseLeave(event) {
            vm.drawing = false;
        }

        function clientMessage(type, value) {
            sawkit.emit('message', {
                type: type,
                value: value
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

        function floodFill(coords) {
            console.log('floodfill!');
        }

        function getCurrent(elements) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].current) {
                    return elements[i];
                }
            };
            return null;
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

        sawkit.on('message', function (message) {
            // if (message.type !== 'brush') {
            //     console.log('handleMessage: type = ' + message.type + ', value = ' + message.value);
            // }

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
                    brush(message.coords);
                    break;
                }
                case 'player-joined': {
                    vm.players = message.value;
                    break;
                }
                case 'error': {
                    alert.show('warning', 'Error', message.value);
                    break;
                }
                default: {
                    alert.show('warning', 'Error', 'No handler found for type: ' + message.type);
                    return;
                }
            }
        });


    }
})();
