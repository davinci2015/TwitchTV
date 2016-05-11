var gulp        = require('gulp');
var sync        = require('run-sequence');
var sass        = require('gulp-sass');
var uglify      = require('gulp-uglify');
var cleanCSS    = require('gulp-clean-css');
var gulpif 	    = require('gulp-if');
var browser     = require('browser-sync');
var concat      = require('gulp-concat');
var argv 		= require('yargs').argv;
var webpack 	= require('webpack-stream');

var paths = {
	app	    : ['app/**/*.{jsx,js,scss}', 'index.html'],
	sass    : 'app/scss/main.scss',
	js 	    : 'app/js/main.js',
	toCopy  : 'index.html',
	dest    : 'dist/'
};

gulp.task('sass', function () {
	return gulp.src(paths.sass)
		.pipe(sass())
		.pipe(gulpif( argv.production, cleanCSS() ))
		.pipe(gulp.dest(paths.dest));
});

gulp.task('js', function () {
	return gulp.src(paths.js)
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulpif( argv.production, uglify() ))
		.pipe(gulp.dest(paths.dest));
});

gulp.task('copy', function () {
	return gulp.src(paths.toCopy)
		.pipe(gulp.dest(paths.dest));
});

gulp.task('serve', function() {
  browser({
    port: process.env.PORT || 3000,
    open: false,
    ghostMode: false,
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('watch', function () {
	gulp.watch(paths.app, ['sass', 'js', 'copy', browser.reload]);
});

gulp.task('default', function (done) {
	sync('sass', 'js', 'copy', 'serve', 'watch', done);
});