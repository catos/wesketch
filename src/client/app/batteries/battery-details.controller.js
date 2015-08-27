(function () {
    'use strict';

    angular
        .module('app.batteries')
        .controller('BatteryDetailsController', BatteryDetailsController);

    BatteryDetailsController.$inject = ['$location', '$stateParams', 'batteriesService'];

    function BatteryDetailsController($location, $stateParams, batteriesService) {
        var vm = this;
        vm.battery = {};
        vm.title = '';
        vm.message = '';
        vm.submit = submit;
        vm.del = del;
        vm.action = '';
        
        console.log('BatteryDetailsController -> $stateParams.id: ' + $stateParams.id);
        
        activate();

        function activate() {
            batteriesService.get(
                { id: $stateParams.id },
                function (data) {
                    vm.battery = data;

                    if (vm.battery && vm.battery.name) {
                        vm.action = 'update';
                        vm.title = "Edit: " + vm.battery.name;
                    } else {
                        vm.action = 'create';
                        vm.title = "New Battery";
                    }

                },
                function (response) {
                    vm.message = response.statusText + ' - ' + response.data.message;
                });
        };

        function submit() {
            if (vm.action === 'update') {
                vm.battery.$update({ id: vm.battery._id },
                    function (data) {
                        vm.message = 'Update complete.';
                    },
                    function (response) {
                        vm.message = response.statusText + ' - ' + response.data.message;
                    });
            } else {
                vm.battery.$save(
                    function (data) {
                        vm.message = 'Save complete.';
                    },
                    function (response) {
                        vm.message = response.statusText + ' - ' + response.data.message;
                    });
            }
        };

        function del() {
            vm.battery.$delete({ id: vm.battery._id },
                function (data) {
                    $location.path('/');
                },
                function (response) {
                    vm.message = response.statusText + ' - ' + response.data.message;
                });
        }

    };
} ());