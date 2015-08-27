(function () {
	'use strict';

	angular
		.module('app.recipes')
		.config(configureRoutes);		
	
	configureRoutes.$inject = ['$stateProvider'];

	function configureRoutes($stateProvider) {
		$stateProvider
			.state('recipes', {
                url: '/recipes',
                templateUrl: 'app/recipes/recipes.html',
                controller: 'RecipesController',
                controllerAs: 'vm'
            });

	}
}());