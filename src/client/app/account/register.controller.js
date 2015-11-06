(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$auth', 'identity'];
    function RegisterController($auth, identity) {
        var vm = this;
        vm.name = '';
        vm.email = '';
        vm.password = '';
        vm.submit = submit;

        function submit() {
            $auth
                .signup({
                    name: vm.name,
                    email: vm.email,
                    password: vm.password
                })
                .then(function (res) {
                    console.log('success - Account Created! - Welcome, ' + res.data.user.email + '!');
                    $auth.setToken(res);
                    identity.login(res.data.user);
                })
                .catch(function (err) {
                    console.log('warning - Something went wrong :(', err.message);
                });
        }
    }
})();