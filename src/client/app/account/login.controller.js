(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$auth', 'alert', 'identity'];

    function LoginController($auth, alert, identity) {
        var vm = this;
        vm.email = '';
        vm.password = '';
        vm.submit = submit;

        function submit() {
            $auth
                .login({
                    email: vm.email,
                    password: vm.password
                })
                .then(function (res) {
                    alert.show('success', 'Welcome!', 'Thanks for coming back, ' + res.data.user.email + '!');
                    identity.login(res.data.user);
                })
                .catch(function (err) {
                    alert.show('warning', 'Something went wrong :(', err.message);
                });
        }
    }
})();