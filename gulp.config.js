module.exports = function() {
	var client = './src/client/';
	
	var config = {
		
		temp: './.tmp',
				
		// All the .js we want to analyze
		allJs: [
			'./src/**/*.js',
			'./*.js'
		],
		
		less: client + 'styles/styles.less'
	};
	
	return config;
};