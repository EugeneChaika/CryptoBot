
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var bs = require('browser-sync').create();
var pug = require('gulp-pug');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('sass', function () {
    return gulp.src('app/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('app/css'))
        .pipe(bs.stream({match: '**/*.css'}));
});

gulp.task('pug', function buildHTML() {
    return gulp.src('app/template/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('app/'))
        .pipe(bs.stream());
});

gulp.task('bs', function () {
    bs.init({
        server: {
            baseDir: 'app'
        },
        browser: "google chrome"
    })
});

gulp.task('serve', ['sass','pug'], function(){

    bs.init({
        server: "app",
        open: false
    });

    gulp.watch("app/sass/**/*.scss", ['sass']);
    gulp.watch("app/template/**/*.pug", ['pug']);
    gulp.watch("app/js/*.js").on('change', bs.reload);
});

gulp.task('useref', function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
    return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ], {
            verbose: true
        })))
        .pipe(gulp.dest('dist/img'))
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('favicon', function() {
    return gulp.src('app/*.ico')
        .pipe(gulp.dest('dist'))
});

gulp.task('clean:dist', function() {
    return del.sync('dist');
});

gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
});

gulp.task('clean', function() {
    return del.sync('dist').then(function(cb) {
        return cache.clearAll(cb);
    });
});

gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['sass', 'pug', 'useref', 'images', 'fonts', 'favicon'],
        callback
    )
});

gulp.task('default', ['serve']);

// 'use strict';
//
// var postcss = require('gulp-postcss');
// var autoprefixer = require('autoprefixer');
// var cssnano = require('cssnano');
// var svgSprite = require("gulp-svg-sprites");
// var replace = require('gulp-replace');
// var foreach = require('gulp-foreach');
// var concat = require('gulp-concat');
//
// gulp.task('css', function () {
//     var plugins = [
//         autoprefixer({browsers: ['last 10 version']}),
//         cssnano()
//     ];
//     return gulp.src('./css/*.css')
//         .pipe(sourcemaps.init())
//         .pipe(postcss(plugins))
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('./postcss'));
// });
//
// gulp.task('sprites', function () {
//     return gulp.src('img/test/*.svg')
//         .pipe(foreach(function(stream, file){
//             var title = file.history[0];
//             var realTitle = title.match(/test\/(.*).svg/i)[1];
//             return stream
//                 .pipe(replace('cls', realTitle + 'cls'))
//         }))
//         .pipe(svgSprite({
//             mode: "symbols"
//         }))
//         .pipe(gulp.dest("svg-sprite"));
// });
