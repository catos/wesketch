module.exports = function () {
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
		client: client,
		index: client + 'index.html',
		js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
		clientCss: client + 'styles/**/*.css',
		less: client + 'styles/styles.less',
		server: server,
		temp: temp,
		tempCss: temp + '**/*.css', //'styles.css',
				

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
		defaultPort: 3000,
		nodeServer: './src/server/server.js'
	};

	config.getWiredepDefaultOptions = function () {
		var options = {
			bowerJson: config.bower.json,
			directory: config.bower.directory,
			ignorePath: config.bower.ignorePath
		};

		return options;
	};

	return config;
};