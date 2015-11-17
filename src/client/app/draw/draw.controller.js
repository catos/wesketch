(function() {
    'use strict';

    angular
        .module('app.draw')
        .controller('DrawController', DrawController);

    DrawController.$inject = ['drawService', 'sawkit'];

    function DrawController(drawService, sawkit) {
        var canvas = null;
        var vm = this;
        vm.mousedown = mousedown;
        vm.mousemove = mousemove;
        vm.drawService = drawService;

        init();

        function init() {
            if (canvas == null) {
                canvas = document.getElementById("canvas");
                vm.drawService.init(canvas);
            }
        }

        function mousedown($event) {
            vm.drawService.mousedown($event);
        }

        function mousemove($event) {
            vm.drawService.mousemove($event);
        }

        /**
         * Socket listener
         */
        sawkit.on('draw-update', function(coords) {
            // console.log('draw-update: ', coords);
            vm.drawService.draw(coords);
        });


    }
})();


// var vm = this;
// var canvas;
// var ctx;
//
// vm.mousedown = mousedown;
// vm.mousemove = mousemove;
// vm.mouseup = mouseup;
// vm.drawing = false;
//
// vm.coords = {
//     from: {
//         x: 0,
//         y: 0
//     },
//     to: {
//         x: 0,
//         y: 0
//     }
// }
//
// init();
//
// function init() {
//     if (ctx == null) {
//         canvas = document.getElementById("canvas");
//         ctx = canvas.getContext('2d');
//     }
// }
//
// /**
//  * Socket listener
//  */
// sawkit.on('draw-update', function(coords) {
//     // console.log('on.draw, coords: ', coords);
//     draw(coords);
// });
//
// /**
//  * Public functions
//  */
// function mousedown($event) {
//     vm.coords.from.x = $event.offsetX;
//     vm.coords.from.y = $event.offsetY;
//
//     // begins new line
//     ctx.beginPath();
//
//     vm.drawing = true;
// }
//
// function mousemove($event) {
//     if (vm.drawing) {
//         vm.coords.to.x = $event.offsetX;
//         vm.coords.to.y = $event.offsetY;
//
//         sawkit.emit('draw-update', vm.coords);
//
//         // set current coordinates to last one
//         vm.coords.from.x = vm.coords.to.x;
//         vm.coords.from.y = vm.coords.to.y;
//     }
// }
//
// function mouseup($event) {
//     vm.drawing = false;
// }
//
// /**
//  * Private functions
//  */
// function draw(coords) {
//     // console.log('draw, from: ', coords);
//
//     // line from
//     ctx.moveTo(coords.from.x, coords.from.y);
//     // to
//     ctx.lineTo(coords.to.x, coords.to.y);
//     // color
//     ctx.strokeStyle = "#f99"; //"#4bf";
//     ctx.lineWidth = 2;
//     // draw it
//     ctx.stroke();
// }
