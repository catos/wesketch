(function () {
	'use strict';

	angular
		.module('app.chat')
		.controller('ChatController', ChatController);

	ChatController.$inject = ['alert', 'identity', 'sawkit'];
	function ChatController(alert, identity, sawkit) {
		var vm = this;
		vm.messages = [{ message: 'Welcome to the chat!' }];
		vm.newMessage = '';
		vm.sendMessage = sendMessage;

		var user = identity.currentUser.name;
		
		sawkit.on('user-join', function (user) {
			vm.messages.push({ message: user.name + ' joined...' });
		});

		sawkit.on('user-message', function (message) {
			vm.messages.push(message);
		});

		function sendMessage(message) {
			if (message.length) {
				sawkit.emit('user-message', { user: user, message: message });
				vm.newMessage = '';
			}
		}

	}
})();