(function () {
	'use strict';

	angular
		.module('app.home')
		.controller('HomeController', HomeController)

	/* @ngInject */
	function HomeController() {
		var vm = this;
		vm.message = 'Hei, fra HomeController';
		

		activate();

		function activate() {
			// Insert initial 
		}
	}
}());