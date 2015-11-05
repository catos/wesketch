(function () {
	'use strict';

	angular
		.module('app.layout')
		.controller('LayoutController', LayoutController)

	/* @ngInject */
	function LayoutController() {
		var vm = this;
		vm.message = 'Hei, fra LayoutController';

		activate();

		function activate() {
			// Insert initial 
		}
	}
}());