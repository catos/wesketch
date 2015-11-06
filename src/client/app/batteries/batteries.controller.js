(function () {
	'use strict';

	angular
		.module('app.batteries')
		.controller('BatteriesController', BatteriesController);

	BatteriesController.$inject = ['$state', '$stateParams'];

	function BatteriesController($state, $stateParams) {
		var vm = this;
		vm.message = 'Hei, fra BatteriesController';

		activate();

		function activate() {
			vm.message = $stateParams.message;
		}
	}
}());