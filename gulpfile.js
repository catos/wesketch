var gulp = require('gulp');
var args = require('yargs').argv;
var stylish = require('jshint-stylish');
var config = require('./gulp.config.js')();

var $ = require('gulp-load-plugins')({ lazy: true });

gulp.task('vet', function () {
	log('Analyzing source with JSHint');
	return gulp
		.src(config.allJs)
		.pipe($.if(args.verbose, $.print()))
		.pipe($.jshint())
		.pipe($.jshint.reporter(stylish));
		// .pipe($.jshint.reporter('fail'));
});


gulp.task('styles', function () {
	log('Compiling Less -> CSS');
	
	return gulp
		.src(config.less)
		.pipe($.less())
		.pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
		.pipe(gulp.dest(config.temp));	
	
});

///////////////////

function log(message) {
	if (typeof(message) === 'object') {
		for (var item in message) {
			if (message.hasOwnProperty(item)) {
				$.util.log($.util.colors.blue(message[item]));
			}
		}
	} else {
		$.util.log($.util.colors.blue(message));
	}
}