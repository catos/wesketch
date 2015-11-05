(function () {
	'use strict';

	angular
		.module('app.account')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['$auth', '$state'];

	function LoginController($auth, $state) {
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
                    alert('success', 'Welcome!', 'Thanks for coming back, ' + res.data.user.email + '!');
                })
                .catch(handleError);
        }

        function authenticate(provider) {
            $auth.authenticate(provider).then(function (res) {
                alert('success', 'Welcome!', 'Thanks for coming back, ' + res.data.user.name + '!');
            }, handleError);
        };

		function handleError(err) {
            // alert.show('warning', 'Something went wrong :(', err.message);
            console.log('error: ', err);
        }
	}
})();