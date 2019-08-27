const rimraf = require('rimraf');
const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
// const babel = require('gulp-babel');
const buildDir = 'build';
const libDir = 'build/lib';
// const esDir = 'build/es';

var uglifyjs = require('uglify-es');
const composer = require('gulp-uglify/composer');
var minify = composer(uglifyjs, console);

const compile = () => {
  rimraf.sync(buildDir);
  return gulp
    .src(
      // './src/lib.js'
      [
        // react
        // './node_modules/react/umd/react.production.min.js',
        // './node_modules/react-dom/umd/react-dom.production.min.js',
        // './node_modules/react-router-dom/umd/react-router-dom.min.js',
        // './node_modules/prop-types/prop-types.min.js',
        // './node_modules/history/umd/history.min.js',
        // // redux
        // './node_modules/redux/dist/redux.min.js',
        // './node_modules/react-redux/dist/react-redux.min.js',

        // './node_modules/single-spa/lib/umd/single-spa.min.js',
        // systemjs
        './node_modules/systemjs/dist/system.js',
        './node_modules/systemjs/dist/extras/amd.js',
        './node_modules/systemjs/dist/extras/named-register.js',
        './node_modules/systemjs/dist/extras/use-default.js',
        './node_modules/systemjs-css-extra/dist/css.min.js',
      ]
    )
    .pipe(concat('common-vendors.js'))
    .pipe(gulp.dest(libDir))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minify())
    .pipe(gulp.dest(libDir));
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
