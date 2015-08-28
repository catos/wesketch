(function () {
	'use strict';

	angular
		.module('app.recipes')
		.config(configureRoutes);		
	
	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('recipes', {
				abstract: true,
                url: '/recipes',
                templateUrl: 'app/recipes/recipes.html',
            })
			.state('recipes.list', {
				url: '',
				templateUrl: 'app/recipes/recipes-list.html',
                controller: 'RecipesController',
                controllerAs: 'vm'				
			});

	}
}());