(function () {
    'use strict';

    angular
        .module('app.batteries')
        .controller('BatteryDetailsController', BatteryDetailsController);

    BatteryDetailsController.$inject = ['$location', '$state', '$stateParams', '$timeout', 'batteriesService'];

    function BatteryDetailsController($location, $state, $stateParams, $timeout, batteriesService) {
        var vm = this;
        vm.battery = {};

        vm.title = '';        
        vm.message = '';        
        vm.action = '';

        vm.submit = submit;
        vm.addCycle = addCycle;
        vm.deleteCycle = deleteCycle;
        vm.del = del;

        vm.newCycle = { created: new Date() };
        vm.datepickerIsOpened = false;
        vm.toggleDatepicker = toggleDatepicker;

        activate();

        function activate() {
            batteriesService.get(
                { id: $stateParams.id },
                function (data) {
                    vm.battery = data;

                    if (vm.battery && vm.battery.name) {
                        vm.action = 'update';
                        vm.title = "Edit Battery";
                    } else {
                        vm.action = 'create';
                        vm.title = "New Battery";
                    }

                },
                function (response) {
                    setMessage(response.statusText + ' - ' + response.data.message);
                });
        }

        function setMessage(message) {
            vm.message = message;
            $timeout(function() {
                vm.message = '';
            }, 2000);
        }
        
        function toggleDatepicker() {
            vm.datepickerIsOpened = !vm.datepickerIsOpened;
        }

        function addCycle() {
            vm.battery.cycles.push(vm.newCycle);
            vm.newCycle = { created: new Date() };
            submit('Cycle added');
        }
        
        function deleteCycle(index) {
            vm.battery.cycles.splice(index, 1);
            submit('Cycle deleted');
        }

        function submit(message) {
            if (vm.action === 'update') {
                vm.battery.$update({ id: vm.battery._id },
                    function (data) {
                        setMessage(message || 'Update complete.');
                    },
                    function (response) {
                        setMessage(response.statusText + ' - ' + response.data.message);
                    });
            } else {
                vm.battery.$save(
                    function (data) {
                        setMessage('Save complete.');
                    },
                    function (response) {
                        setMessage(response.statusText + ' - ' + response.data.message);
                    });
            }
        }

        function del() {
            vm.battery.$delete({ id: vm.battery._id },
                function (data) {
                    $location.path('/');
                },
                function (response) {
                    setMessage(response.statusText + ' - ' + response.data.message);
                });
        }

    }
} ());