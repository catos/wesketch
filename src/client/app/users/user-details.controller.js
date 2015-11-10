(function () {
    'use strict';

    angular
        .module('app.users')
        .controller('UserDetailsController', UserDetailsController);

    UserDetailsController.$inject = ['$stateParams', 'alert', 'usersService'];
    function UserDetailsController($stateParams, alert, usersService) {
        var vm = this;
        vm.user = {};
        vm.title = '';
        vm.isUpdateAction;
        vm.submit = submit;

        activate();

        function activate() {

            usersService.get(
                { id: $stateParams.id },
                function (data) {
                    vm.user = data;
                    vm.isUpdateAction = !!(vm.user && vm.user.name);

                    if (vm.isUpdateAction) {
                        vm.title = "Edit: " + vm.user.name;
                    } else {
                        vm.title = "New User";
                    }

                },
                function (response) {
                    alert.show('info', 'User loaded', response.statusText + ' - ' + response.data.message);
                });

        }

        function submit() {
            if (vm.isUpdateAction) {
                vm.user.$update({ id: vm.user._id },
                    function (data) {
                        alert.show('info', 'Update user', 'Update complete.');
                    },
                    errorHandler);
            } else {
                vm.user.$save(
                    function (data) {
                        alert.show('info', 'Create user', 'User has been created.');
                    },
                    errorHandler);
            }
        }
        
        function errorHandler(response) {
            alert.show('danger', response.data.name, response.data.message);
        }
    }
})();