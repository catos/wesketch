(function () {
	'use strict';

	angular
		.module('app.layout')
		.controller('HeaderController', HeaderController);

	HeaderController.$inject = ['tokenIdentity'];

	function HeaderController(tokenIdentity) {
		var vm = this;
		vm.tokenIdentity = tokenIdentity;
	}
})();
