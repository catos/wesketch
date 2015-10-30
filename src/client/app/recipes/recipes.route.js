(function () {
	'use strict';

	angular
		.module('app.recipes')
		.config(configureRoutes);		
	
	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('layout.recipes', {
				abstract: true,
                url: '/recipes',
                templateUrl: 'app/recipes/recipes.html',
            })
			.state('layout.recipes.list', {
				url: '',
				templateUrl: 'app/recipes/recipes-list.html',
                controller: 'RecipesController',
                controllerAs: 'vm',
				// TODO: ...resolve some shit
				// resolve: {
				// 	.....
				// }				
			});

	}
}());