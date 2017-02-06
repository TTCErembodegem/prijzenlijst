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


var locals = {
  dranken150: {
    price: '1,50',
    items: ['Cola / Light / Zero', 'Jupiler / Hoegaerden', 'Spa / Vittel', 'Koffie / Soep (!?)'],
    itemsShort: 'Cola / Jupiler / Hoegaerden / Spa / Vittel / Koffie / Soep (!?)',
  },
  dranken200: {
    price: '2,00',
    items: ['Ice-Tea', 'Wijn', 'Carlsberg'],
    itemsShort: 'Ice-Tea / Wijn / Carlsberg',
  },
  drankenAq: {
    price: '2,50',
    items: ['Aquarius (flesje)', 'Orange / Lemon / Red Peach'],
    itemsShort: null,
  },
  drankenZwareBieren: {
    price: '2,50',
    items: ['Zware bieren', 'Leffe / Blond / Donker (!?)', 'Duvel / La Chouffe (!?)'],
    itemsShort: 'Aquarius / Leffe / Duvel / La Chouffe',
  },
  versnaperingen: {
    price: '1,00',
    items: ['Chips / Zout / Paprika', 'Chocolade / Suikerwafel'],
    itemsShort: 'Chips / Chocolade / Suikerwafel',
  },
};


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
    locals: locals,
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
