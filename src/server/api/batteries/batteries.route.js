module.exports = function (app, config) {
	var routeHandler = require('../../blocks/routeHandler')(config);

	var batteriesRouter = routeHandler.getApiRouter('batteries');
    
    app.use('/api/batteries', batteriesRouter);
};