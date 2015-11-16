(function () {
	'use strict';

	angular
		.module('app.chat')
		.controller('ChatController', ChatController);

	ChatController.$inject = ['alert', 'sawkit', 'tokenIdentity'];
	function ChatController(alert, sawkit, tokenIdentity) {
		var vm = this;
		vm.messages = [];
        vm.user = {};
        vm.users = [];

		vm.newMessage = '';
		vm.sendMessage = sendMessage;

        activate();

        function activate() {
            vm.messages.push({
                message: 'Welcome to the chat!'
            });

            vm.user = {
                name: tokenIdentity.currentUser.name
            };

            sawkit.emit('user-join', vm.user);
        }

		sawkit.on('user-join', function (users) {
			vm.users = users;
		});

		sawkit.on('user-message', function (message) {
			vm.messages.push(message);
			console.log('messages: ', vm.messages);
		});

        sawkit.on('user-disconnect', function (user) {
			vm.messages.push({ message: user.name + ' joined...' });
		});

		function sendMessage(message) {
			if (message.length) {
				sawkit.emit('user-message', {
                    sent: Date.now(),
                    user: vm.user,
                    message: message
                });
				vm.newMessage = '';
			}
		}

	}
})();
