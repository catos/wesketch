var express = require('express');

module.exports = function (config) {
	var module = {};

	module.getRouter = function (name) {
		var router = express.Router(),
			controller = require('../' + name + '/' + name + '.controller');

		router.all('*', controller.init);
		router.get('/', controller.index)
		router.get('/:id', controller.get)
		router.post('/', controller.create);
		router.put('/:id', controller.update)
		router.delete('/:id', controller.destroy);

		return router;
	};

	return module;
};
