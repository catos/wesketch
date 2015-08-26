(function () {
	'use strict';

	angular
		.module('app.recipes')
		.run(appRun);
	
	appRun.$inject = ['routerHelper'];
	
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}
	
	function getStates() {
		return [
			{
				state: 'recipes',
				config: {
					url: '/recipes',
					templateUrl: 'app/recipes/recipes.html',
					controller: 'RecipesController',
					controllerAs: 'vm',
				}
			},
		];
	}

} ());