
(function () {
    'use strict';

    angular
        .module('app.draw')
        .directive('drawing', Drawing);

    function Drawing() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: DrawingController,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            scope: {
            }
        };
        return directive;

        function link(scope, element, attrs, ctrl) {
            var ctx = element[0].getContext('2d');
            ctrl.init(ctx);

            // variable that decides if something should be drawn on mousemove
            var drawing = false;

            // the last coordinates before the current move
            var lastX;
            var lastY;
            var currentX;
            var currentY;

            element.bind('mousedown', function (event) {
                if (event.offsetX !== undefined) {
                    lastX = event.offsetX;
                    lastY = event.offsetY;
                } else { // Firefox compatibility
                    lastX = event.layerX - event.currentTarget.offsetLeft;
                    lastY = event.layerY - event.currentTarget.offsetTop;
                }

                drawing = true;
            });
            element.bind('mousemove', function (event) {
                if (drawing) {
                    // get current mouse position
                    if (event.offsetX !== undefined) {
                        currentX = event.offsetX;
                        currentY = event.offsetY;
                    } else {
                        currentX = event.layerX - event.currentTarget.offsetLeft;
                        currentY = event.layerY - event.currentTarget.offsetTop;
                    }

                    draw(lastX, lastY, currentX, currentY);

                    // set current coordinates to last one
                    lastX = currentX;
                    lastY = currentY;
                }

            });
            element.bind('mouseup', function (event) {
                // stop drawing
                drawing = false;
            });

            // canvas reset
            function reset() {
                element[0].width = element[0].width;
            }

            function draw(lastX, lastY, currentX, currentY) {

                // ctrl.update(lX, lY, cX, cY);
                ctrl.update({ lastX, lastY, currentX, currentY });

                // // line from
                // ctx.moveTo(lX, lY);
                // // to
                // ctx.lineTo(cX, cY);
                // // color
                // ctx.strokeStyle = "#4bf";
                // // draw it
                // ctx.stroke();
            }
        }
    }

    DrawingController.$inject = ['$scope', 'sawkit'];

    function DrawingController($scope, sawkit) {
        var vm = this;
        var ctx;
        vm.init = init;
        vm.draw = draw;
        vm.update = update;

        function init(_ctx) {
            console.log('ctrl->init');
            if (ctx == null) {
                ctx = _ctx;
            }
            console.log('ctx: ', ctx);
        }

        sawkit.on('draw', function (coords) {
            // console.log('on.draw: ', coords);
            draw(coords);
        });

        function draw(coords) {
            // console.log('draw, coords: ', coords);

            // begins new line
            ctx.beginPath();
            // line from
            ctx.moveTo(coords.lastX, coords.lastY);
            // to
            ctx.lineTo(coords.currentX, coords.currentY);
            // color
            ctx.strokeStyle = "#f99"; //"#4bf";
            // draw it
            ctx.stroke();
        }

        function update(coords) {
            // console.log('update, coords: ', coords);
            sawkit.emit('draw', coords);
        }

    }
})();
