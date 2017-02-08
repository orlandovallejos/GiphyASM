/* global require */
var gulp = require("gulp");
var $ = require('gulp-load-plugins')();

var paths = {
    scripts: "app/js/",
    scripts_build: 'js/',
    styles:'app/css/',
    styles_build: 'css/'
};

var source = {
    scripts: [
        paths.scripts + 'app.module.js',
        paths.scripts + 'modules/**/*.module.js',
        paths.scripts + 'modules/**/*.js',
    ],
    styles:paths.styles + '**/*.css'
};

var dest = {
    js: 'app.js',
    styles:'styles.css'
};

var vendor = {
    source: require('./vendor.json'),
    js: 'base.js',
    css: 'base.css'
};

// JS APP
gulp.task('scripts', function () {
    console.log('Building scripts..');

    return gulp.src(source.scripts)
        .pipe($.concat(dest.js))
        .on('error', handleError)
        .pipe(gulp.dest(paths.scripts_build))
        .on('error', handleError);
});

gulp.task('styles', function () {
    console.log('Building styles...');

    return gulp.src(source.styles)
        .pipe($.concat(dest.styles))
        .on('error', handleError)
        .pipe(gulp.dest(paths.styles_build))
        .on('error', handleError);
});

gulp.task('vendor', function () {
    console.log('Copying base vendor assets..');

    var jsFilter = $.filter('**/*.js', {
        restore: true
    });
    var cssFilter = $.filter('**/*.css', {
        restore: true
    });

    return gulp.src(vendor.source)
        .pipe($.expectFile(vendor.source))
        .pipe(jsFilter)
        .pipe($.concat(vendor.js))
        .pipe(gulp.dest(paths.scripts_build))
        .pipe(jsFilter.restore())

        .pipe(cssFilter)
        .pipe($.concat(vendor.css))
        .pipe(gulp.dest(paths.styles_build))
        .pipe(cssFilter.restore());
});

gulp.task('default', [
    'scripts',
    'styles',
    'vendor'
]);

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}