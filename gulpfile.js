'use strict';

// Generate html templates on file save
// To start a static http server:
// $ npm run serve

var src = './templates/';
var dest = './dist/';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var pug = require('gulp-pug');

gulp.task('pug', function() {
  gulp.src(src + '*.pug')
  .pipe(plumber())
  .pipe(pug({
    locals: {},
    pretty: true
  }))
  .pipe(gulp.dest(dest));
});


gulp.task('watch', function() {
  gulp.watch(src + '**/*', ['pug']);
});

gulp.task('build', ['pug']);
gulp.task('default', ['build', 'watch']);
