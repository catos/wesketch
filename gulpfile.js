var gulp = require('gulp');
var args = require('yargs').argv;
// var browserSync = require('browser-sync');
var stylish = require('jshint-stylish');
var config = require('./gulp.config.js')();
var del = require('del');
var $ = require('gulp-load-plugins')({ lazy: true });
var port = process.env.PORT || config.defaultPort;
var wiredep = require('wiredep').stream;

gulp.task('vet', function () {
	log('Analyzing source with JSHint');
	return gulp
		.src(config.allJs)
		.pipe($.if(args.verbose, $.print()))
		.pipe($.jshint())
		.pipe($.jshint.reporter(stylish));
	// .pipe($.jshint.reporter('fail'));
});


gulp.task('css', function () {
	log('Copying CSS from development styles');

	return gulp
		.src(config.clientCss)
		.pipe(gulp.dest(config.temp));
});

gulp.task('styles', ['clean-styles'], function () {
	log('Compiling Less -> CSS');

	return gulp
		.src(config.less)
		.pipe($.plumber()) // exit gracefully if something fails after this
		.pipe($.less())
		.pipe($.autoprefixer({
			browsers: ['last 2 version', '> 5%']
		}))
		.pipe(gulp.dest(config.temp));

});

gulp.task('clean-styles', function () {
	var files = config.temp + '**/*.css';
	clean(files);
});

gulp.task('less-watcher', function () {
	gulp.watch([config.less], ['styles']);
});

gulp.task('wiredep', function () {
	log('Wire up the bower css js and our app js into the html');
	var options = config.getWiredepDefaultOptions();

	return gulp
		.src(config.index)
		.pipe(wiredep(options))
		.pipe($.inject(gulp.src(config.js)))
		.pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles', 'css'], function () {
	log('Wire up the app css into the html, and call wiredep');

	return gulp
		.src(config.index)
		.pipe($.inject(gulp.src(config.tempCss)))
		.pipe(gulp.dest(config.client));
});

gulp.task('serve-dev', ['inject'], function () {
	var isDev = true;

	var nodeOptions = {
		script: config.nodeServer,
		delayTime: 1,
		env: {
			'PORT': port,
			'NODE_ENV': isDev ? 'dev' : 'build'
		},
		watch: [config.server]
	};

	return $.nodemon(nodeOptions)
		.on('restart', function (ev) {
			log('*** nodemon restarted');
			log('files changed on restart:\n' + ev);
		})
		.on('start', function () {
			log('*** nodemon started');
			// startBrowserSync();
		})
		.on('crash', function () {
			log('*** nodemon crashed: script crashed for some reason');
		})
		.on('exit', function () {
			log('*** nodemon exited cleanly');
		});
});

///////////////////

// function startBrowserSync() {
// 	if (browserSync.active) {
// 		return;
// 	}
	
// 	log('Starting browser-sync on port: ' + port);
	
// 	var options = {
// 		proxy: 'localhost: ' + port,
// 		port: 3001,
// 		files: [config.client + '**/*.*'],
// 		ghostMode: {
// 			clicks: true,
// 			location: false,
// 			forms: true,
// 			scroll: true
// 		},
// 		injectChanges: true,
// 		logFileChanges: true,
// 		logLevel: 'debug',
// 		logPrefix: 'gulp-patterns',
// 		notify: true,
// 		reloadDelay: 1000
// 	};
	
// 	browserSync(options);
// }

function clean(path) {
	log('Cleaning: ' + $.util.colors.blue(path));
	return del(path);
}

function log(message) {
	if (typeof (message) === 'object') {
		for (var item in message) {
			if (message.hasOwnProperty(item)) {
				$.util.log($.util.colors.blue(message[item]));
			}
		}
	} else {
		$.util.log($.util.colors.blue(message));
	}
}