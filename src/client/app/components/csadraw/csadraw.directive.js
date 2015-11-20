(function() {
    'use strict';

    angular
        .module('components.csadraw')
        .directive('csadraw', csadraw);

    function csadraw() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/components/csadraw/csadraw.html',
            scope: {
            },
            link: linkFunc,
            controller: 'CsadrawController',
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
            ctrl.init();
        }
    }
})();
