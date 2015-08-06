(function() {
	'use strict';
	
	angular
		.module('app')
		.controller('Batteries', Batteries);
		
	function Batteries() {
		var vm = this;		
		vm.message = 'Hello from Batteries.controller!';
		vm.click = click;
		
		function click() {
			vm.message = 'Message has been altered by some fucking btn!';
		}
	}
		

}());