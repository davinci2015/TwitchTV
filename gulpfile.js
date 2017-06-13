const gulp = require('gulp');
const sync = require('run-sequence');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const gulpif = require('gulp-if');
const browser = require('browser-sync');
const concat = require('gulp-concat');
const argv = require('yargs').argv;
const webpack = require('webpack-stream');

const paths = {
    app: ['app/**/*.{jsx,js,scss}', 'index.html'],
    sass: 'app/scss/main.scss',
    js: 'app/js/main.js',
    toCopy: 'index.html',
    dest: 'docs/'
};

gulp.task('sass', function () {
    return gulp.src(paths.sass)
        .pipe(sass())
        .pipe(gulpif(argv.production, cleanCSS()))
        .pipe(gulp.dest(paths.dest));
});

gulp.task('js', function () {
    return gulp.src(paths.js)
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulpif(argv.production, uglify()))
        .pipe(gulp.dest(paths.dest));
});

gulp.task('copy', function () {
    return gulp.src(paths.toCopy)
        .pipe(gulp.dest(paths.dest));
});

gulp.task('serve', function () {
    browser({
        port: process.env.PORT || 3000,
        open: false,
        ghostMode: false,
        server: {
            baseDir: 'docs'
        }
    });
});

gulp.task('watch', function () {
    gulp.watch(paths.app, ['sass', 'js', 'copy', browser.reload]);
});

gulp.task('default', function (done) {
    sync('sass', 'js', 'copy', 'serve', 'watch', done);
});