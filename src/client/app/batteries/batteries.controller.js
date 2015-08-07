/// <reference path="../../../../typings/angularjs/angular.d.ts"/>

(function () {
	'use strict';

	angular
		.module('app')
		.controller('BatteriesController', BatteriesController);

	BatteriesController.$inject = ['batteriesService'];

	function BatteriesController(batteriesService) {
		var vm = this;
		vm.batteries = [];
		
		activate()
		
		function activate() {
			batteriesService.query(
				{},
				function (data) {
					vm.batteries = data;
				}
			)
		}

	}


} ());