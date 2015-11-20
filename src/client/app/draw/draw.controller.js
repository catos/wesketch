(function() {
    'use strict';

    angular
        .module('app.draw')
        .controller('DrawController', DrawController);

    function DrawController() {
        var vm = this;
    }
})();

// function DrawController(drawService, sawkit) {
//     var canvas = null;
//     var vm = this;
//     vm.clear = clear;
//     vm.drawService = drawService;
//     vm.modifyLineWidth = modifyLineWidth;
//     vm.debug = {
//         updates: 0,
//         messages: 0,
//     };
//
//     init();
//
//     function init() {
//         if (canvas == null) {
//             canvas = document.getElementById("canvas");
//             vm.drawService.init(canvas);
//         }
//     }
//
//     function clear() {
//         sawkit.emit('draw-message', {
//             type: 'clear'
//         });
//     }
//
//     function modifyLineWidth(modifier) {
//         sawkit.emit('draw-message', {
//             type: 'modify-line-width',
//             modifier: modifier
//         });
//     }
//
// }
