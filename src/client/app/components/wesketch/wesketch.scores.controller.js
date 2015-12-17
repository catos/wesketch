(function () {
	'use strict';

	angular
		.module('components.wesketch')
		.controller('WesketchScoresController', WesketchScoresController);

	WesketchScoresController.$inject = ['$uibModalInstance', 'players'];
	function WesketchScoresController($uibModalInstance, players) {
		var vm = this;
		vm.players = players;

		vm.close = close;

		function close() {
			$uibModalInstance.close();
		}
	}
})();