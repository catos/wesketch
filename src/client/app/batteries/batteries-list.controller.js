/// <reference path="../../../../typings/angularjs/angular.d.ts"/>

(function () {
	'use strict';

	angular
		.module('app.batteries')
		.controller('BatteriesListController', BatteriesListController);

	BatteriesListController.$inject = ['batteriesService'];

	function BatteriesListController(batteriesService) {
		var vm = this;
		vm.batteries = [];
		
		activate();
		
		function activate() {
			batteriesService.query(
				{},
				function (data) {
					vm.batteries = data;
				}
			);
		}
	}


} ());