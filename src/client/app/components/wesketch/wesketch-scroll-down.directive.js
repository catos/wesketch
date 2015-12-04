(function () {
	'use strict';

	angular
		.module('components.wesketch')
		.directive('wsScrollDown', ['$timeout', function ($timeout) {
			return {
				scope: {
					wsScrollDown: '='
				},
				link: function ($scope, $element) {
					$scope.$watchCollection('wsScrollDown', function (newValue) {
						if (newValue) {
							$timeout(function () {
								$element.scrollTop($element[0].scrollHeight);
							}, 0);
						}
					});
				}
			};
		}]);

})();
