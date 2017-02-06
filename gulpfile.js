'use strict';

var src = 'templates/';
var dest = 'dist/';

var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var pug = require('gulp-pug');
var browserSync = require('browser-sync').create();
var pdf = require('gulp-html-pdf');
var del = require('del');
var runSequence = require('run-sequence');



gulp.task('clean', function() {
  return del(dest);
});



gulp.task('clean-serve', function() {
  runSequence('clean', 'serve');
});



function toHtml() {
  return gulp.src(src + '*.pug')
  .pipe(plumber())
  .pipe(pug({
    locals: {},
    pretty: true
  }));
}


gulp.task('pug', function() {
  toHtml().pipe(gulp.dest(dest));
});


gulp.task('pdf', function() {
  toHtml()
  .pipe(pdf({base: `file:///${ __dirname}/dist/`}))
  .pipe(gulp.dest(dest))
  .on('end', function() {
    gutil.log('Pdfs created!');
  });
});




gulp.task('copyres', function() {
  gulp.src([src + '**/!(*.pug)']).pipe(gulp.dest(dest));
});



gulp.task('serve', ['build'], function () {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch(src + '**/*.pug', ['pug', 'pdf']);
  gulp.watch(src + '**/!(*.pug)', ['copyres', 'pdf']);
  gulp.watch(dest + '**/*.*').on('change', browserSync.reload); // TODO: great.. since the pdf the reload doesn't work anymore
});



gulp.task('build', ['copyres','pug', 'pdf']);
gulp.task('default', ['clean-serve']);
