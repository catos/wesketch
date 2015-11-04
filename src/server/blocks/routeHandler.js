var express = require('express');

module.exports = function (config) {
	var module = {};

	module.getApiRouter = function (featureName, typeName) {
		if (!typeName) {
			typeName = featureName;
		}		
		
		var router = express.Router({mergeParams: true}),
			controller = require('../api/' + featureName + '/' + typeName + '.controller');

		router.all('*', controller.init);
		router.get('/', controller.index)
		router.get('/:' + typeName + 'Id', controller.get)
		router.post('/', controller.create);
		router.put('/:' + typeName + 'Id', controller.update)
		router.delete('/:' + typeName + 'Id', controller.destroy);

		return router;
	};

	return module;
};