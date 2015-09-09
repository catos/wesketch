(function () {
	'use strict';

	angular
		.module('app.layout')
		.controller('LayoutController', LayoutController)

	LayoutController.$inject = ['accountIdentity'];

	/* @ngInject */
	function LayoutController(accountIdentity) {
		var vm = this;
		vm.message = 'Hei, fra LayoutController';

		activate();

		function activate() {
			// Insert initial 
		}
	}
}());