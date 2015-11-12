(function () {
	'use strict';

	angular
		.module('app.users')
		.controller('UserCreateController', UserCreateController);

	UserCreateController.$inject = ['$state', 'alert', 'usersService'];
	function UserCreateController($state, alert, usersService) {
        var vm = this;
        vm.user = new usersService();
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