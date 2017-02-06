'use strict';

// Generate html templates on file save
// To start a static http server:
// $ npm run serve

var src = './templates/';
var dest = './dist/';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var pug = require('gulp-pug');
var browserSync = require('browser-sync').create();

gulp.task('pug', function() {
  gulp.src(src + '*.pug')
  .pipe(plumber())
  .pipe(pug({
    locals: {},
    pretty: true
  }))
  .pipe(gulp.dest(dest));
});



gulp.task('copyres', function() {
  gulp.src([src + '*.*']).pipe(gulp.dest(dest));
});



gulp.task('serve', ['build'], function () {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch(src + '**/*.pug', ['pug']);
  gulp.watch(src + '**/*.*', ['copyres']);

  gulp.watch(dest + '**/*.*').on('change', browserSync.reload);
});



gulp.task('watch', function() {
  gulp.watch(src + '**/*.pug', ['pug']);
  gulp.watch(src + '**/*.*', ['copyres']);
});

gulp.task('build', ['copyres','pug']);
gulp.task('default', ['serve']);
