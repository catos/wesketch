// (function () {
//     'use strict';

//     angular
//         .module('components.wesketch')
//         .factory('wesketchClientEvents', wesketchClientEvents);

//     wesketchClientEvents.$inject = ['wesketchClientModel', 'wesketchClientSocket'];
//     function wesketchClientEvents(wesketchClientModel, wesketchClientSocket) {
//         var clientEvents = clientEvents || {};

//         return clientEvent;

//         ////////////////
//         function exposedFn() { }


//         function clientEvent(event) {

//             clientEvents.toggleSoundSettings = function (event) {
//                 var setting = event.value;
//                 vm.client.soundSettings[setting] = !vm.client.soundSettings[setting];
//             };

//             clientEvents.setInputGuessMode = function (event) {
//                 vm.client.chat.guessMode = event.value;

//                 var firstChar = vm.client.chat.input.substr(0, 1);
//                 if (!vm.client.chat.guessMode && firstChar === '!') {
//                     vm.client.chat.input = vm.client.chat.input.substr(1, vm.client.chat.input.length);
//                 }

//                 if (vm.client.chat.guessMode && firstChar !== '!') {
//                     vm.client.chat.input = '!' + vm.client.chat.input;
//                 }
//             };

//             clientEvents.addMessage = function (event) {

//                 // Empty messages are not allowed
//                 if (!vm.client.chat.input || vm.client.chat.input === '!') {
//                     return;
//                 }

//                 // Add message to personaly history
//                 vm.client.chat.myMessages.push(vm.client.chat.input);

//                 // Drawing player cannot use chat
//                 if (vm.client.drawingPlayer !== undefined && vm.client.player.id === vm.client.drawingPlayer.id) {
//                     alert.show('warning', 'Permission denied', 'Drawing player can not use chat.');
//                     vm.client.chat.input = '';
//                     return;
//                 }

//                 var eventType = 'addMessage';
//                 var eventValue = {
//                     timestamp: new Date(),
//                     type: 'chat',
//                     from: vm.client.player.name,
//                     message: vm.client.chat.input
//                 };

//                 if (vm.client.chat.input.charAt(0) === '!') {
//                     eventType = 'guessWord';
//                     eventValue.type = 'guess-word';
//                     eventValue.message = vm.client.chat.input.substr(1);
//                 }

//                 wesketchClientSocket.emit(vm.client.player, eventType, eventValue);

//                 vm.client.chat.input = '';

//             };

//             clientEvents.onInputKey = function (event) {
//                 switch (event.value.keyCode) {
//                     // Enter key
//                     case 13: {
//                         vm.clientEvent({
//                             type: 'addMessage'
//                         });
//                         break;
//                     }
//                     // Arrow up
//                     case 38: {
//                         vm.client.chat.input = vm.client.chat.myMessages[vm.client.chat.myMessages.length - 1];
//                         break;
//                     }

//                     // | - Toggle guess mode
//                     case 220: {
//                         vm.client.chat.input = vm.client.chat.input.replace('|', '');
//                         vm.clientEvent({
//                             type: 'setInputGuessMode',
//                             value: !vm.client.chat.guessMode
//                         });
//                         break;
//                     }
//                 }

//                 if (vm.client.chat.guessMode && vm.client.chat.input.substr(0, 1) !== '!') {
//                     vm.client.chat.input = '!' + vm.client.chat.input;
//                 }
//             };

//             clientEvents.default = function (event) {
//                 wesketchClientSocket.emit(vm.client.player, event.type, event.value);
//             };

//             if (clientEvents[event.type]) {
//                 return clientEvents[event.type](event);
//             } else {
//                 return clientEvents.default(event);
//             }
//         };
//     }
// })();