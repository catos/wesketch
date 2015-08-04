var Hapi = require('hapi');

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

// Start the server
server.start(function() {
	console.log('Server running at: ', server.info.uri);
});