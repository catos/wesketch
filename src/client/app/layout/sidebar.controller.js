(function() {
'use strict';

	angular
		.module('app.layout')
		.controller('SidebarController', SidebarController);

	SidebarController.$inject = ['$state'];
	function SidebarController($state) {
		var vm = this;
		

		activate();

		function activate() { }
	}
})();