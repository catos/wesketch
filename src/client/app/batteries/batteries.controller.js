(function () {
	'use strict';

	angular
		.module('app.batteries')
		.controller('BatteriesController', BatteriesController)

	BatteriesController.$inject = ['$state', '$stateParams'];

	function BatteriesController($state, $stateParams) {
		var vm = this;
		vm.message = "";

		activate();

		function activate() {
			console.log('BatteriesController -> activate');
			console.log($stateParams);
			vm.message = $stateParams.message;
		}
	}
}());