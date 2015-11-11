module.exports = function(app, config) {

    // app.use(logErrors);
    app.use(clientErrorHandler);
    app.use(errorHandler);

    // function logErrors(err, req, res, next) {
    //     console.error(err.stack);
    //     next(err);
    // }

    function clientErrorHandler(err, req, res, next) {
        res.status(500);

        var response = {
            title: err.name || '...',
            message: err.message || '...'
        };

        if (req.accepts('json')) {
            res.json(response);
            return;
        }

        if (req.accepts('html')) {
            res.render(config.rootPath + 'server/views/500', response);
            return;
        }

        next(err);
    }

    function errorHandler(err, req, res, next) {

        if (res.headersSent) {
            return next(err);
        }

        res.status(500).send({
            message: err.message
        });
    }

};
