module.exports = function (app, config) {
	var routeHandler = require('../../blocks/routeHandler')(config);

	var batteriesRouter = routeHandler.getApiRouter('batteries');

    //     cyclesRouter = routeHandler.getApiRouter('batteries', 'cycles');
    // batteriesRouter.use('/:batteriesId/cycles', cyclesRouter);
    
    app.use('/api/batteries', batteriesRouter);
}