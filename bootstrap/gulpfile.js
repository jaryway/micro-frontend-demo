const path = require('path');
const rimraf = require('rimraf');
const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const gulpCopy = require('gulp-copy');
// const babel = require('gulp-babel');
const amdOptimize = require('amd-optimize');
const buildDir = 'build';
const libDir = 'build/lib';
// const esDir = 'build/es';

var uglifyjs = require('uglify-es');
const composer = require('gulp-uglify/composer');
var minify = composer(uglifyjs, console);

const concatSystemJS = isAMD => {
  // rimraf.sync(buildDir);
  return gulp
    .src(
      // './src/lib.js'
      [
        // systemjs
        './node_modules/systemjs/dist/system.js',
        isAMD && './node_modules/systemjs/dist/extras/amd.js',
        isAMD && './node_modules/systemjs/dist/extras/named-register.js',
        './node_modules/systemjs/dist/extras/use-default.js',
        './node_modules/systemjs-css-extra/dist/css.min.js',
      ].filter(Boolean)
    )
    .pipe(concat('system.js'))
    .pipe(gulp.dest(`${libDir}${isAMD ? '/amd' : '/root'}`))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minify())
    .pipe(gulp.dest(`${libDir}${isAMD ? '/amd' : '/root'}`));
};

const concatCommonVendors = isAMD => {
  // 如果是 amd 直接合并加了 id 的 文件，不是则合并源码文件
  // /(define\(){1}(\["?'?\w{0,}"?'?\]){0,}/
  return gulp
    .src(
      isAMD
        ? './common-vendors/**/*.*'
        : [
            './node_modules/react/umd/react.production.min.js',
            './node_modules/react-dom/umd/react-dom.production.min.js',
            './node_modules/react-router-dom/umd/react-router-dom.min.js',
            './node_modules/prop-types/prop-types.min.js',
            './node_modules/history/umd/history.min.js',
            './node_modules/redux/dist/redux.min.js',
            './node_modules/react-redux/dist/react-redux.min.js',
            './node_modules/single-spa/lib/umd/single-spa.min.js',
          ]
    )
    .pipe(concat('common-vendors.js'))
    .pipe(gulp.dest(`${libDir}${isAMD ? '/amd' : '/root'}`))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minify())
    .pipe(gulp.dest(`${libDir}${isAMD ? '/amd' : '/root'}`));
};

gulp.task('concat-systemjs-amd', done => {
  console.log('[Parallel] Compile to js...');
  concatSystemJS(true).on('finish', done);
});

gulp.task('concat-vendors-amd', done => {
  console.log('[Parallel] Compile to js...');

  concatCommonVendors(true).on('finish', done);
});

gulp.task('concat-systemjs', done => {
  console.log('[Parallel] Compile to js...');
  concatSystemJS().on('finish', done);
});

gulp.task('concat-vendors', done => {
  console.log('[Parallel] Compile to js...');

  concatCommonVendors().on('finish', done);
});

// gulp.task('concat-js', function(done) {
//   gulp
//     .src(path.resolve('./src/main.js'), {
//       // paths: {
//       //   react: './node_modules/react/umd/react.production.min.js',
//       //   'react-dom': './node_modules/react-dom/umd/react-dom.production.min.js',
//       //   'react-router-dom': './node_modules/react-router-dom/umd/react-router-dom.min.js',
//       //   'prop-types': './node_modules/prop-types/prop-types.min.js',
//       //   history: './node_modules/history/umd/history.min.js',
//       // },
//     })
//     .pipe(
//       amdOptimize('main', {
//         paths: {
//           react: './node_modules/react/umd/react.production.min.js',
//           'react-dom': './node_modules/react-dom/umd/react-dom.production.min.js',
//           'react-router-dom': './node_modules/react-router-dom/umd/react-router-dom.min.js',
//           'prop-types': './node_modules/prop-types/prop-types.min.js',
//           history: './node_modules/history/umd/history.min.js',
//         },
//       })
//     )
//     .pipe(concat('common-vendors.js'))
//     .pipe(gulp.dest(libDir))
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(minify())
//     .pipe(gulp.dest(libDir))
//     .on('finish', done);
// });

// gulp.task('copy-vendor', done => {
//   gulp
//     .src([
//       './node_modules/react/umd/react.production.min.js',
//       './node_modules/react-dom/umd/react-dom.production.min.js',
//       './node_modules/react-router-dom/umd/react-router-dom.min.js',
//       './node_modules/prop-types/prop-types.min.js',
//       './node_modules/history/umd/history.min.js',
//       './node_modules/redux/dist/redux.min.js',
//       './node_modules/react-redux/dist/react-redux.min.js',
//       './node_modules/single-spa/lib/umd/single-spa.min.js',
//     ])
//     .pipe(gulpCopy('common-vendors'))
//     // .pipe(otherGulpFunction())
//     .pipe(gulp.dest('dist'))
//     .on('finish', done);
// });

// gulp.task('default', gulp.parallel('compile-with-es', 'compile-with-lib'));

gulp.task(
  'default',
  gulp.parallel('concat-systemjs-amd', 'concat-vendors-amd', 'concat-systemjs', 'concat-vendors')
);
