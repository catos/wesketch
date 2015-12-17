module.exports = function() {
    var client = './src/client/';
    var clientApp = client + 'app/';
    var server = './src/server/';
    var temp = './.tmp/';
    
    var config = {

        /**
        * Files paths
        */
        allJs: [
            './src/**/*.js',
            './*.js'
        ],
        build: './build/',
        client: client,
        index: client + 'index.html',
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        clientCss: client + 'styles/**/*.css',
        fonts: [
            './bower_components/fontawesome/fonts/**/*.*',
            './bower_components/bootstrap/fonts/**/*.*'
        ],
        html: client + '**/*.html',
        htmltemplates: clientApp + '**/*.html',
        images: client + 'images/**/*.*',
        less: client + 'styles/*.less',
        server: server,
        sounds: client + 'sounds/**/*.*',
        source: 'src/',
        temp: temp,
        tempCss: temp + '**/*.css',

        /**
        * templateCache
        */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                standAlone: false,
                root: 'app/'
            }  
        },

        /**
        * Browser sync
        */
        browserReloadDelay: 1000,

        /**
        * Bower and NPM locations
        */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },

        /**
        * Node settings
        */
        defaultPort: '7203',
        nodeServer: './src/server/server.js'
    };

    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };

        return options;
    };

    return config;
};
