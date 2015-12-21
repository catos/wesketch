/* global process */
var args = require('yargs').argv;
var config = require('./gulp.config.js')();
var del = require('del');
var gulp = require('gulp');
var stylish = require('jshint-stylish');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')({ lazy: true });
var useref = require('gulp-useref');
var port = process.env.PORT || config.defaultPort;
var environment = process.env.NODE_ENV || 'development';

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

/**
 * Lint
 **/

gulp.task('lint', function () {
    log('Analyzing source with JSHint');
    return gulp
        .src(config.allJs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish));
});

/**
 * Client config
 */

gulp.task('clean-config', function () {
    return clean(config.temp + 'ngConstants.js');
});

gulp.task('config', ['clean-config'], function () {
    log('Create and copy configuration');

    var myConfig = require('./config.json');

    // .src(config.clientConfig)
    return $.ngConstant({
        name: 'app.config',
        constants: myConfig[environment],
        stream: true
    })
    .pipe(gulp.dest(config.temp));
});

/**
 * Clean
 **/

gulp.task('clean', function () {
    var delconfig = [].concat(config.build, config.temp);
    log('Cleaning: ' + $.util.colors.blue(delconfig));
    del(delconfig);
});

gulp.task('clean-fonts', function () {
    return clean(config.build + 'fonts/**/*.*');
});

gulp.task('clean-images', function () {
    return clean(config.build + 'images/**/*.*');
});

gulp.task('clean-sounds', function () {
    return clean(config.build + 'sounds/**/*.*');
});

gulp.task('clean-styles', function () {
    return clean(config.temp + '**/*.css');
});

gulp.task('clean-code', function () {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + 'js/**/*.js'
        );
    return clean(files);
});

/**
 * CSS, LESS, fonts and images
 **/

gulp.task('css', function () {
    log('Copying CSS from development styles');

    return gulp
        .src(config.clientCss)
        .pipe(gulp.dest(config.temp));
});

gulp.task('fonts', ['clean-fonts'], function () {
    log('Copying fonts');

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('images', ['clean-images'], function () {
    log('Copying and compressing the images');

    return gulp
        .src(config.images)
        .pipe($.imagemin({ optimizationLevel: 4 }))
        .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('sounds', ['clean-sounds'], function () {
    log('Copying sounds');

    return gulp
        .src(config.sounds)
        .pipe(gulp.dest(config.build + 'sounds'));
});

gulp.task('styles', ['css', 'clean-styles'], function () {
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

/**
 * Watchers
 **/

// TODO: kan jeg fjerne denne ?
// gulp.task('less-watcher', function () {
//     log('Less watcher is running');
//     gulp.watch([config.less], ['styles', 'css']);
// });

// , ['clean-code']
gulp.task('templatecache', function () {
    log('Creating AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.minifyHtml({ empty: true }))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
            ))
        .pipe(gulp.dest(config.temp));
});

gulp.task('wiredep', function () {
    log('Wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var jsFiles = [].concat(
        config.js,
        config.tempJs
        );

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(jsFiles)))
        .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'config', 'styles', 'fonts', 'images', 'sounds', 'templatecache'], function () {
    log('Wire up the app css into the html, and call wiredep');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.tempCss)))
        .pipe(gulp.dest(config.client));
});

gulp.task('optimize', ['inject'], function () {
    log('Optimizing the javascript, css, html');

    var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(gulp.src(templateCache, { read: false }), {
            starttag: '<!-- inject:templates:js -->'
        }))
        .pipe(useref({ searchPath: './' }))
        .pipe(gulp.dest(config.build));
});

gulp.task('serve-build', ['optimize'], function () {
    serve(false /* isDev */);
});

// gulp.task('serve-dev', ['less-watcher'], function () {
gulp.task('serve-dev', ['inject'], function () {
    serve(true /* isDev */);
});

// ------------------------------

function serve(isDev) {

    var nodeOptions = {
        script: config.nodeServer,
        ext: 'js',
        ignore: [
            config.index
        ],
        env: {
            PORT: port,
            NODE_ENV: isDev ? 'development' : 'production'
        },
        watch: [
            config.source
        ],
        // delayTime: 1,
        // tasks: ['inject', 'lint']
    };

    return $.nodemon(nodeOptions)
        .on('restart', function (ev) {
            log('*** Nodemon restarted');
            log('files changed on restart:\n' + ev);
        })
    // TODO: her må jeg kjøre optimize (ikke inject) hvis det er prod
        .on('start', ['inject', 'lint'], function () {
            log('*** Nodemon started');

            // TODO: Funker dette ?
            gulp.watch([config.less], ['styles', 'css']);
        })
        .on('crash', function () {
            log('*** Nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** Nodemon exited cleanly.');
        });
}

function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

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
