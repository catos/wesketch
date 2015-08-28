/// <reference path="../../../../typings/angularjs/angular.d.ts"/>

(function () {
	'use strict';

	angular
		.module('app.batteries')
		.controller('BatteriesController', BatteriesController);

	BatteriesController.$inject = ['batteriesService'];

	function BatteriesController(batteriesService) {
		var vm = this;
		vm.batteries = [];
		
		activate();
		
		function activate() {
			console.log("BatteriesController -> activate()");
			batteriesService.query(
				{},
				function (data) {
					vm.batteries = data;
				}
			)
		}

	}


} ());