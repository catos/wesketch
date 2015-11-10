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
    }
})();