(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$auth', '$state', 'alert', 'tokenIdentity'];

    function LoginController($auth, $state, alert, tokenIdentity) {
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
                    alert.show('info', 'Welcome!', 'Thanks for coming back, ' + res.data.user.email + '!');
                    tokenIdentity.login(res.data.user);
                    $state.go('layout.home');
                })
                .catch(function (err) {
                    alert.show('warning', 'Something went wrong :(', err.message);
                });
        }
    }
})();
