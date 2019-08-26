const rimraf = require('rimraf');
const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
// const babel = require('gulp-babel');
const libDir = 'build/lib';
const esDir = 'build/es';

var uglifyjs = require('uglify-es');
const composer = require('gulp-uglify/composer');
var minify = composer(uglifyjs, console);

const compile = modules => {
  rimraf.sync(modules !== false ? libDir : esDir);
  return gulp
    .src(
      // './src/lib.js'
      [
        './node_modules/systemjs/dist/system.js',
        './node_modules/systemjs/dist/extras/amd.js',
        './node_modules/systemjs/dist/extras/use-default.js',
      ]
    )
    .pipe(concat('system.js'))
    .pipe(gulp.dest(modules === false ? esDir : libDir))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minify())
    .pipe(gulp.dest(modules === false ? esDir : libDir));
};

// gulp.task('compile-with-es', done => {
//   console.log('[Parallel] Compile to es...');
//   compile(false).on('finish', done);
// });

gulp.task('compile-with-lib', done => {
  console.log('[Parallel] Compile to js...');
  compile().on('finish', done);
});

// gulp.task('default', gulp.parallel('compile-with-es', 'compile-with-lib'));

gulp.task('default', gulp.parallel('compile-with-lib'));
