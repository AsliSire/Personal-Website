const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const htmlValidator = require('gulp-w3c-html-validator');
const   through2 =      require('through2');
const browserSync = require('browser-sync').create();

//scss to css
function style() {
  return gulp.src('assets/scss/**/*.scss', { sourcemaps: true })
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('assets/css', { sourcemaps: '.' }))
    .pipe(browserSync.reload({stream: true}));
}

//Html validator
function validateHtml() {
    function handleFile(file, encoding, callback) {
        callback(null, file);
        if (!file.w3cjs.success)
            throw new Error('HTML validation error(s) found');
    };
    return gulp.src('html/*.html')
        .pipe(htmlValidator())
        .pipe(through2.obj(handleFile));
}

// Watch function
function watch(){
  browserSync.init({
      proxy: 'localhost/Unice/html'
  });
  gulp.watch('assets/scss/**.*scss', style);
  gulp.watch('./*.html').on('change', browserSync.reload);
  gulp.watch('assets/css/**.css').on('change', browserSync.reload);
}

exports.style = style;
exports.watch = watch;
exports.validateHtml = validateHtml;

const build = gulp.series(watch);
gulp.task('default', build);
