(function () {
    'use strict';

    angular
        .module('app')
        .controller('BatteryDetailsController', BatteryDetailsController);

    BatteryDetailsController.$inject = ['$routeParams', 'batteriesService'];

    function BatteryDetailsController($routeParams, batteriesService) {
        var vm = this;
        vm.battery = {};
        vm.message = '';
        vm.submit = submit;
        init();

        function init() {
            batteriesService.get(
                { id: $routeParams.id },
                function (data) {
                    vm.battery = data;
                },
                function (response) {
                    vm.message = response.statusText + '\n\r';

                    if (response.data.modelState) {
                        for (var key in response.data.modelState) {
                            vm.message += response.data.modelState[key] + '\n\r';
                        }
                    }

                    if (response.data.exceptionMessage) {
                        vm.message += response.data.exceptionMessage;
                    }
                });

            // if (vm.product && vm.product.productId) {
            //     vm.title = "Edit: " + vm.product.productName;
            // } else {
            //     vm.title = "New Product";
            // }
        };

        function submit() {
            
            // Update
            if (vm.battery._id) {
                vm.battery.$update({ id: vm.battery._id },
                    function (data) {
                        vm.message = 'Update complete.';
                    },
                    function (response) {
                        console.log(response);
                        vm.message = response.statusText + '\n\r';

                        if (response.data.modelState) {
                            for (var key in response.data.modelState) {
                                vm.message += response.data.modelState[key] + '\n\r';
                            }
                        }

                        if (response.data.exceptionMessage) {
                            vm.message += response.data.exceptionMessage;
                        }
                    });
            } else {
                
            }
        }

    };
} ());