(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$auth', 'alert', 'tokenIdentity'];
    function RegisterController($auth, alert, tokenIdentity) {
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
                    alert.show('success', 'Account Created!', 'Welcome, ' + res.data.user.email + '!');
                    $auth.setToken(res);
                    tokenIdentity.login(res.data.user);
                })
                .catch(function (err) {
                    alert.show('warning', 'Something went wrong :(', err.message);
                });
        }
    }
})();
