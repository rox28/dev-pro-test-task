const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass')(require('sass'));

const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');

const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');

const cssFiles = [
   './src/styles/main.scss'
];

function styles() {
   return gulp.src(cssFiles)
   .pipe(sourcemaps.init())
   .pipe(sass())
   .pipe(concat('styles.css'))
   .pipe(autoprefixer())
   .pipe(cleanCSS({
      level: 2
   }))
   .pipe(sourcemaps.write('./'))
   .pipe(gulp.dest('./build/styles'))
   .pipe(browserSync.stream());
}

function fonts() {
	return gulp.src('./src/fonts/*')
	.pipe(gulp.dest('./build/fonts/'));
}

function images() {
	return gulp.src('./src/images/*')
	.pipe(newer('./build/images/'))
	.pipe(imagemin())
	.pipe(gulp.dest('./build/images/'));
}

function video() {
	return gulp.src('./src/video/*')
	.pipe(gulp.dest('./build/video/'));
}

function clean() {
   return del(['build/*']);
}

function watch() {
   browserSync.init({
      server: {
          baseDir: "./"
      }
  });
  gulp.watch('./src/styles/*.scss', styles); 
  gulp.watch('./src/styles/bs/*.scss', styles);
  gulp.watch("./*.html").on('change', browserSync.reload);
  gulp.watch('./src/fonts/*', fonts);
  gulp.watch('./src/images/*', images);
  gulp.watch('./src/video/*', video);
}

gulp.task('styles', styles);
gulp.task('fonts', fonts);
gulp.task('images', images);
gulp.task('video', video);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('build', gulp.series(gulp.parallel(styles, fonts, images, video)));
gulp.task('dev', gulp.series('build','watch'));
gulp.task('default', gulp.series('build','watch'));