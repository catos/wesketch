/*

BROADCAST:

[Client]
    Change Color Event
    Send Message
[Server]
    On Broadcast Message -> Send Broadcast Message
[Client]
    Receieve Message
    Change Color

*/
(function() {
    'use strict';

    angular
        .module('components.csadraw')
        .controller('CsadrawController', CsadrawController);

    CsadrawController.$inject = ['alert', 'sawkit'];

    function CsadrawController(alert, sawkit) {
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
        vm.settings = {
            strokeStyle: '#333',
            lineWidth: 2,
            lineJoin: 'round',  // 'butt', 'round', 'square'
            lineCap: 'round'    // 'bevel', 'round', 'miter'
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

        }

        sawkit.on('message', function(message) {
            if (message.type !== 'draw') {
                console.log('handleMessage: ' + message.type);
            }

            switch (message.type) {
                case 'set-stroke-style':
                    vm.settings.strokeStyle = message.value;
                    break;
                case 'set-line-width':
                    vm.settings.lineWidth = message.value;
                    break;
                case 'clear':
                    vm.ctx.clearRect(0, 0, vm.canvas.width, vm.canvas.height);
                    break;
                case 'draw':
                    draw(message.coords);
                    break;
                default:
                    alert.show('warning', 'Csadraw!', 'handler not found for message, type = ' + message.type);
                    return;
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
                    type: 'draw',
                    coords: vm.coords
                });

                vm.coords.from = vm.coords.to;
            }
        }

        function onMouseLeave(event) {
            vm.drawing = false;
        }

        function clientMessage(message) {
            validateClientMessage(message, function(err, message) {

                if (err) {
                    alert.show('warning', 'Csadraw!', 'Invalid client message: ' + err.message);
                    return;
                }

                sawkit.emit('message', {
                    type: message.type,
                    value: message.value
                });
            });

        }

        /**
         * Private functions
         */
        function draw(coords) {
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

        function validateClientMessage(message, cb) {
            var validTypes = [
                'clear',
                'set-stroke-style',
                'set-line-width'
            ];

            if (!message.type) {
                cb(new Error('Type is undefined'));
                return;
            }

            if (validTypes.indexOf(message.type) === -1) {
                cb(new Error('Invalid type: "' + message.type + '"'));
                return;
            }

            cb(null, message);
        }
    }
})();
