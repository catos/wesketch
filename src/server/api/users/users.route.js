module.exports = function (app, config) {
	var routeHandler = require('../../blocks/routeHandler')(config);

	var usersRouter = routeHandler.getApiRouter('users');
    
    app.use('/api/users', usersRouter);
};