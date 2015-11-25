(function () {
    'use strict';

    angular
        .module('app.draw')
        .factory('drawService', drawService);

    drawService.$inject = ['sawkit'];

    /* @ngInject */
    function drawService(sawkit) {
        var settings = {
            strokeStyle: '#333',
            lineWidth: 2,
            lineJoin: 'round',  // 'butt', 'round', 'square'
            lineCap: 'round'    // 'bevel', 'round', 'miter'
        };

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
            start: start,
            move: move,
            stop: stop,
            draw: draw,

            settings: settings,

            handleMessage: handleMessage,
        };

        return service;

        function init(canvas) {
            // console.log('draw.service -> init');
            if (service.ctx == null) {
                service.canvas = canvas;

                service.canvas.onmousedown = start;
                service.canvas.onmouseup = stop;
                service.canvas.onmousemove = move;
                service.canvas.onmouseleave = leave;

                service.ctx = canvas.getContext('2d');

                // Settings
                service.ctx.strokeStyle = settings.strokeStyle;
                service.ctx.lineWidth = settings.lineWidth;
                service.ctx.lineJoin = settings.lineJoin;
                service.ctx.lineCap = settings.lineCap;


                /**
                 * Socket listeners
                 */
                sawkit.on('draw-update', function (coords) {
                    console.log('draw-update');
                    draw(coords);
                });

                sawkit.on('draw-message', function (message) {
                    handleMessage(message);
                });

                console.log(settings);
            }
        }

        function start(event) {
            console.log('draw.service->mousedown');
            var coords = getCoords(event);
            service.coords.from = coords;
            service.drawing = true;
        }

        function move(event) {
            if (service.drawing) {
                // console.log('draw.service->mousemove');
                var coords = getCoords(event);
                service.coords.to = coords;

                sawkit.emit('draw-update', service.coords);
                draw(service.coords);

                // set current coordinates to last one
                service.coords.from = service.coords.to;

            }
        }

        function stop(event) {
            service.drawing = false;
        }

        function leave(event) {
            service.drawing = false;
            console.log('leaving canvas!');
        }

        function draw(coords) {
            // console.log('draw.service->draw');
            service.ctx.beginPath();
            service.ctx.moveTo(coords.from.x, coords.from.y);
            service.ctx.lineTo(coords.to.x, coords.to.y);
            service.ctx.stroke();
        }

        function handleMessage(message) {
            switch (message.type) {
                case 'set-stroke-style':
                    console.log('set-stroke-style: ' + message.strokeStyle);
                    service.ctx.strokeStyle = message.strokeStyle;
                    break;
                case 'modify-line-width':
                    service.ctx.lineWidth += message.modifier;
                    console.log('new line-width: ' + service.ctx.lineWidth);
                    break;
                case 'clear':
                    clear();
                    break;
                default:
                    return;
            }
        }

        /**
         * Private functions
         */
        function clear() {
            service.ctx.clearRect(0, 0, service.ctx.canvas.width, service.ctx.canvas.height);
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
