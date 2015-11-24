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

    CsadrawController.$inject = ['sawkit'];

    function CsadrawController(sawkit) {
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

        vm.clear = clear;
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

        /**
         * Events
         */
        function onMouseDown(event) {
            console.log('onMouseDown: ', getCoords(event));
            vm.coords.from = getCoords(event);
            vm.drawing = true;
        }

        function onMouseUp(event) {
            console.log('onMouseUp: ', getCoords(event));
            vm.drawing = false;
        }

        function onMouseMove(event) {
            //  console.log('onMouseMove: ', getCoords(event));
            if (vm.drawing) {
                vm.coords.to = getCoords(event);
                // console.log('drawing...', vm.coords);

                sawkit.emit('message', {
                    type: 'draw',
                    coords: vm.coords
                });

                // set current coordinates to last one
                vm.coords.from = vm.coords.to;

            }
        }

        function onMouseLeave(event) {
            console.log('onMouseLeave: ', getCoords(event));
            vm.drawing = false;
        }

        /**
         * Socket events
         */
        sawkit.on('message', function(message) {
            handleMessage(message);
        });

        /**
         * Public functions
         */
        function clear() {
            console.log('clear');
            // sawkit.emit('draw-message', {
            //     type: 'clear'
            // });
            vm.ctx.clearRect(0, 0, vm.canvas.width, vm.canvas.height);
        }

        /**
         * Private functions
         */
        function handleMessage(message) {
            switch (message.type) {
                case 'set-stroke-style':
                    console.log('set-stroke-style: ' + message.strokeStyle);
                    vm.ctx.strokeStyle = message.strokeStyle;
                    break;
                case 'modify-line-width':
                    vm.ctx.lineWidth += message.modifier;
                    console.log('new line-width: ' + vm.ctx.lineWidth);
                    break;
                case 'clear':
                    clear();
                    break;
                case 'draw':
                    draw(message.coords);
                    break;
                default:
                    return;
            }
        }


        function draw(coords) {
            // console.log('draw.service->draw');
            vm.ctx.beginPath();
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
