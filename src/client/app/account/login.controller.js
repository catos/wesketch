(function () {
	'use strict';

	angular
		.module('app.account')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['$auth', '$state', 'identity'];

	function LoginController($auth, $state, identity) {
		var vm = this;
		vm.email = '';
		vm.password = '';
		vm.submit = submit;
        vm.authenticate = authenticate;

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
                .catch(handleError);
        }

        function authenticate(provider) {
            $auth.authenticate(provider).then(function (res) {
                console.log('authenticate:success - Welcome! - Thanks for coming back, ' + res.data.user.name + '!');
            }, handleError);
        };

		function handleError(err) {
            // alert.show('warning', 'Something went wrong :(', err.message);
            console.log('error: ', err);
        }
	}
})();