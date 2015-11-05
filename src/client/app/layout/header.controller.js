(function () {
	'use strict';

	angular
		.module('app.layout')
		.controller('HeaderController', HeaderController);

	HeaderController.$inject = ['identity'];

	function HeaderController(identity) {
		var vm = this;
		vm.identity = identity;
		
		console.log('vm.identity.currentUser: ', vm.identity.currentUser);
	}
})();