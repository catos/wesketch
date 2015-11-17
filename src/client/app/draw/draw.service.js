(function() {
    'use strict';

    angular
        .module('app.draw')
        .factory('drawService', drawService);

    drawService.$inject = ['sawkit'];

    /* @ngInject */
    function drawService(sawkit) {
        var service = {
            canvas: null,
            ctx: null,
            coords: {
                    from: {
                        x: 0,
                        y: 0
                    },
                    to: {
                        x: 0,
                        y: 0
                    }
                },
            drawing: false,

            /**
             * Functions
             */
            init: init,
            mousedown: mousedown,
            mousemove: mousemove,
            mouseup: mouseup,
            draw: draw,

            settings: {
                strokeStyle: "#333",
                lineWidth: 2
            },
            setStrokeStyle: setStrokeStyle,
            setLineWidth: setLineWidth
        };

        return service;

        function init(canvas) {
            // console.log('draw.service -> init');
            if (service.ctx == null) {
                service.canvas = canvas;
                service.ctx = canvas.getContext('2d');

                service.ctx.strokeStyle = service.strokeStyle;
                service.ctx.lineWidth = service.lineWidth;
            }
        }

        /**
         * Public functions
         */
        function mousedown(event) {
            // console.log('draw.service->mousedown');
            service.coords.from.x = event.offsetX;
            service.coords.from.y = event.offsetY;

            // begins new line
            service.ctx.beginPath();

            service.drawing = true;
        }

        function mousemove(event) {
            if (service.drawing) {
                // console.log('draw.service->mousemove');
                service.coords.to.x = event.offsetX;
                service.coords.to.y = event.offsetY;

                sawkit.emit('draw-update', service.coords);

                // set current coordinates to last one
                service.coords.from.x = service.coords.to.x;
                service.coords.from.y = service.coords.to.y;
            }
        }

        function mouseup() {
            service.drawing = false;
        }

        function draw(coords) {
            // console.log('draw.service->draw');
            service.ctx.moveTo(coords.from.x, coords.from.y);
            service.ctx.lineTo(coords.to.x, coords.to.y);
            service.ctx.stroke();
        }

        function setStrokeStyle(color) {
            console.log('setStrokeStyle, color: ' + color);
            service.ctx.strokeStyle = color;
            sawkit.emit('draw-settings', service.coords);
        }

        function setLineWidth(size) {
            service.ctx.lineWidth = size;
        }
    }
})();
