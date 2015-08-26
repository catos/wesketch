angular
	.module('app.batteries')
	.run(appRun);

appRun.$inject = ['routerHelper'];

function appRun(routerHelper) {
	console.log('batteries.route.js: ', getStates());
	routerHelper.configureStates(getStates());
}

function getStates() {
	return [
		{
			state: 'batteries',
			config: {
				url: '/batteries',
				templateUrl: 'app/batteries/batteries.html',
				controller: 'BatteriesController',
				controllerAs: 'vm',
			}
		},
		{
			state: 'batteries.detail',
			config: {
				url: '/batteries/:id',
				templateUrl: 'app/batteries/battery-details.html',
				controller: 'BatteryDetailsController',
				controllerAs: 'vm',
			}
		}		
	];
}