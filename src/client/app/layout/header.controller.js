(function() {
'use strict';

	angular
		.module('app.layout')
		.controller('HeaderController', HeaderController);

	HeaderController.$inject = ['accountIdentity'];
	function HeaderController(accountIdentity) {
		var vm = this;
		vm.identity = accountIdentity;
		vm.message = 'Hei, fra HeaderController';

		activate();

		function activate() { }
	}
})();