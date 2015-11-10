(function() {
'use strict';

	angular
		.module('app.users')
		.controller('UsersListController', UsersListController);

	UsersListController.$inject = ['usersService'];
	function UsersListController(usersService) {
		var vm = this;
		vm.users = [];
		
		activate();
		
		function activate() {
			usersService.query(
				{},
				function (data) {
					vm.users = data;
				}
			);
		}
	}
})();