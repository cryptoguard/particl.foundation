'use strict';

/* ------------------------------------ *\
    Includes
\* ------------------------------------ */

var gulp = require('gulp');
// Pump - https://github.com/mafintosh/pump
var pump = require('pump');
// Sass autocompile - https://github.com/dlmanning/gulp-sass
var sass = require('gulp-sass');
// CSS Autoprefixer - https://github.com/sindresorhus/gulp-autoprefixer
var autoprefixer = require('gulp-autoprefixer');
// Concat ("merge JS") - https://github.com/contra/gulp-concat 
var concat = require('gulp-concat');
// JS Uglyfy - https://www.npmjs.com/package/gulp-uglify
var uglify = require('gulp-uglify');
// BrowserSync - https://www.browsersync.io
//var browserSync = require('browser-sync').create();
// Sourcemaps - https://github.com/gulp-sourcemaps/gulp-sourcemaps
var sourcemaps = require('gulp-sourcemaps');
// SVGO - https://www.npmjs.com/package/gulp-svgmin
var svgmin = require('gulp-svgmin');
// Iconfont - https://github.com/nfroidure/gulp-iconfont
var iconfont = require('gulp-iconfont');
// Iconfont CSS - https://github.com/backflip/gulp-iconfont-css
var iconfontCss = require('gulp-iconfont-css');


/* ------------------------------------ *\
    Paths
    - https://arwhd.co/2015/05/18/svg-gulp-workflow/
\* ------------------------------------ */

const paths = {
  // templates
  template: '**/*.html',
  // CSS
  scss: 'assets/scss/**/*.scss',
  css: 'assets/css',
  // JS
  js: 'assets/js/src/',
  js_in: 'assets/js/src/**/*.js',
  js_out: 'assets/js',
  // iconfont
  ico_input: 'assets/img/icons/**/*.svg',
  ico_output: 'assets/img/icons/',
  font_output: 'assets/fonts/',
}


/* ------------------------------------ *\
    Tasks
\* ------------------------------------ */

// Compile Sass to CSS (and minify) + feed updates to BrowserSync
gulp.task('sass', function (cb) {
  pump([
    gulp.src(paths.scss),
    sourcemaps.init(),
    sass({outputStyle: 'compressed'}).on('error', sass.logError),
    autoprefixer({
      browsers: ['> 0.01%'], // https://github.com/ai/browserslist#queries
      cascade: false
    }),
    sourcemaps.write(''),
    gulp.dest(paths.css),
    /*browserSync.reload({
      stream: true
    }),*/
  ], cb );
});


// Concatenate JavaScript and uglify
gulp.task('scripts', function (cb) {
  pump([
    gulp.src([
      paths.js + 'modernizr.min.js',
      paths.js + 'jquery-1.11.2.min.js',
      paths.js + 'brickst.js',
    ]),
    sourcemaps.init(),
    concat('app.js'),
    uglify(),
    sourcemaps.write(''),
    gulp.dest(paths.js_out),
    /*browserSync.reload({
      stream: true
    }),*/
  ], cb );
});

/*
// Launch BrowserSync server
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    },
  })
});
*/

// Optimize SVGs
gulp.task('optimize', function (cb) {
  console.log('-- Optimizing SVG files');
  pump([
    gulp.src(paths.ico_input),
    svgmin(),
    gulp.dest(paths.ico_output),
  ], cb );
});


// Generate iconfont from SVG icons
gulp.task('webfont', ['optimize'], function (cb) {
  console.log('-- Generating webfont');
  pump([
    gulp.src(paths.ico_input),
    iconfontCss({
      fontName: 'icons',
      fontPath: '../fonts/',
      targetPath: '../scss/_icons.scss',
      cssClass: 'ico'
    }),
    iconfont({
      fontName: 'icons',
      prependUnicode: true,
      formats: ['ttf', 'eot', 'woff', 'woff2'],
      normalize: true,
      fontHeight: 1001,
      descent: 140,
     }),
    gulp.dest(paths.font_output),
  ], cb );
});


// Watch for Sass/JS changes and compile + BrowserSync
//gulp.task('watch', ['browserSync', 'sass'], function () {
gulp.task('watch', ['sass', 'scripts'], function () { // 'browserSync', 'webfont'
  gulp.watch(paths.scss, ['sass']);
  gulp.watch(paths.js_in, ['scripts']);
  gulp.watch(paths.ico_input, ['webfont']);
  //gulp.watch(paths.template, browserSync.reload); 
});

// Manual build (Sass compiling, JS concat/uglify)
gulp.task('build', ['sass', 'scripts', 'webfont'], function (){
  console.log('-- Building files');
});

gulp.task('default', ['build'], function (){
});