(function () {
	'use strict';

	angular
		.module('app.users')
		.controller('UserCreateController', UserCreateController);

	UserCreateController.$inject = ['$state', 'alert', 'UsersService'];
	function UserCreateController($state, alert, UsersService) {
        var vm = this;
        vm.user = new UsersService();
        vm.submit = submit;

		function submit() {
			vm.user.$save(
				function (data) {
					alert.show(
						'info', 'Create user', 'User has been created.');
					$state.go('layout.users.list');
				},
				errorHandler);
		}

        // --------------------------------

        function errorHandler(response) {
            alert.show('danger', response.data.name, response.data.message);
        }

	}
})();