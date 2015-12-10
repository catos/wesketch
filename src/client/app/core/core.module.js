(function () {
	'use strict';

	angular.module('app.core', [
		'ngResource',
		'satellizer',

		'blocks.alert',
		'blocks.sawkit',
		'blocks.tokenIdentity'
	]);
})();