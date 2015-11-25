(function() {
'use strict';

	angular
		.module('app.users')
		.controller('UsersListController', UsersListController);

	UsersListController.$inject = ['UsersService'];
	function UsersListController(UsersService) {
		var vm = this;
		vm.users = [];
		
		activate();
		
		function activate() {
			UsersService.query(
				{},
				function (data) {
					vm.users = data;
				}
			);
		}
	}
})();