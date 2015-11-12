(function () {
    'use strict';

    angular
        .module('app.users')
        .controller('UserEditController', UserEditController);

    UserEditController.$inject = ['$state', '$stateParams', 'alert', 'usersService'];

    function UserEditController($state, $stateParams, alert, usersService) {
        var vm = this;
        vm.user = {};
        vm.submit = submit;
        vm.del = del;

        activate();

        function activate() {

            usersService.get(
                {
                    id: $stateParams.id
                },
                function (data) {
                    vm.user = data;
                },
                function (response) {
                    errorHandler(response);
                });

        }

        function submit() {
            vm.user.$update(
                {
                    id: vm.user._id
                },
                function (data) {
                    alert.show('info', 'Update user', 'Update complete.');
                },
                errorHandler);
        }

        function del() {
            vm.user.$delete(
                {
                    id: vm.user._id
                },
                function (data) {
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
