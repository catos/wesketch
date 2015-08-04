var Hapi = require('hapi');
var Good = require('good');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        
        var response = 
            '<h1>Hello World</h1>' 
            + '<p>Follow the tutorials here: <a href="http://hapijs.com/tutorials">Hapi Tutorials</a></p>'
            + '<p>Repository can be found here: <a href="https://github.com/catos/CSA">Github</a></p>'
            + '<p>Test out this fancy new route: <a href="/Cato">Hello, Cato</a></p>';
        reply(response);
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }
    
    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
})
