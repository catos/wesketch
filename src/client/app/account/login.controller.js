(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$auth', 'identity'];

    function LoginController($auth, identity) {
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
                    console.log('submit: success - Welcome! - Thanks for coming back, ' + res.data.user.email + '!');
                    identity.login(res.data.user);
                })
                .catch(function (err) {
                    console.log('error: ', err);
                });
        }
    }
})();