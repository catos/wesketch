(function() {
    'use strict';

    angular
        .module('components.csadraw')
        .controller('CsadrawController', CsadrawController);

    CsadrawController.$inject = ['sawkit'];

    function CsadrawController(sawkit) {
        var vm = this;
        vm.clear = clear;
        vm.init = init;
        vm.drawing = drawing;
        
        var canvas,
            ctx,
            drawing = false;

        function init() {
            var canvas = document.getElementById('canvas');
            if (canvas !== undefined) {
                canvas.onmousedown = onMouseDown;
                canvas.onmouseup = onMouseUp;
                canvas.onmousemove = onMouseMove;
                canvas.onmouseleave = onMouseLeave;
                ctx = canvas.getContext('2d');
            }
        }

        /**
         * Events
         */
         function onMouseDown(event) {
             console.log('onMouseDown: ', getCoords(event));
             drawing = true;
         }

         function onMouseUp(event) {
             console.log('onMouseUp: ', getCoords(event));
             drawing = false;
         }

         function onMouseMove(event) {
             console.log('onMouseMove: ', getCoords(event));
         }

         function onMouseLeave(event) {
             console.log('onMouseLeave: ', getCoords(event));
             drawing = false;
         }

        /**
         * Public functions
         */
        function clear() {
            sawkit.emit('draw-message', {
                type: 'clear'
            });
            ctx.clearRect(0, 0, canvas.width, canvas.height);
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
