(function () {
	'use strict';

	angular
		.module('app.recipes')
		.controller('RecipesController', RecipesController);

	function RecipesController() {
		var vm = this;
		vm.recipes = [];
		
		activate();
		
		function activate() {
			vm.recipes = [
				{
					name: 'Bløtkake',
					description: 'En helt vanlig bløtkake',
					ingredients: [
						{
							name: 'sugar',
							amount: 200,
							unit: 'gr'
						}						
					]
				},
				{
					name: 'Pasta',
					description: 'Nydelig hjemmelaged pasta',
					ingredients: [
						{
							name: 'mel',
							amount: 3,
							unit: 'never'
						},
						{
							name: 'egg',
							amount: 2,
							unit: 'stk'
						},
						{
							name: 'salt',
							amount: 2,
							unit: 'klyper'
						},
						{
							name: 'olivenolje',
							amount: 2,
							unit: 'ss'
						}
					]
				}
			];
		}

	}


} ());