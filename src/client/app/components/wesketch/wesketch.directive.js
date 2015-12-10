(function () {
    'use strict';

    angular
        .module('components.wesketch')
        .directive('wesketch', wesketch);

    // TODO: move back to feature, this is not a component
    function wesketch() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/components/wesketch/wesketch.html',
            scope: {
            },
            link: linkFunc,
            controller: 'WesketchController',
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {

        }
    }
})();
