var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var tsc = require('gulp-typescript');
var tslint = require('gulp-tslint');
var tsProject = tsc.createProject('tsconfig.json');

var browserSync = require('browser-sync');
var superstatic = require('superstatic');

var PATH = {
  src: 'app/**/*.ts'
};

gulp.task('ts-lint', function() {
  return gulp.src(PATH.src)
    .pipe(tslint())
    .pipe(tslint.report('prose', {
      emitError: false
    }));
});

gulp.task('compile-ts', function() {
  var tsResult = gulp
    .src(PATH.src)
    .pipe(sourcemaps.init())
    .pipe(tsc(tsProject));

  return tsResult.js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./app'));
});

gulp.task('serve', ['ts-lint', 'compile-ts'], function() {

  gulp.watch([PATH.src], ['ts-lint', 'compile-ts']);

  browserSync({
    port: 3000,
    files: ['index.html', '**/*.js', '**/*.css'],
    injectChanges: true,
    logFileChanges: false,
    logLevel: 'silent',
    notify: false,
    reloadDelay: 0,
    server: ['./', 'app'],
  });

});

gulp.task('default', ['serve']);
