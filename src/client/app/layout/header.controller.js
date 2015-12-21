(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['appConfig', 'tokenIdentity'];

    function HeaderController(appConfig, tokenIdentity) {
        var vm = this;
        vm.appConfig = appConfig;
        vm.tokenIdentity = tokenIdentity;
        vm.fullscreen = fullscreen;

        function fullscreen($event) {
            $event.stopPropagation();

            var elem = document.getElementById('fw-wrapper');
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }

            return false;
        }

    }
})();
