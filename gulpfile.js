/*eslint-env node */

const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
// var eslint = require('gulp-eslint');
// var jasmine = require('gulp-jasmine-phantom');

gulp.task('default', ['scripts-dist', 'copy-html', 'styles'], function() {
	gulp.watch('css/**/*.css', ['styles']);
	gulp.watch('js/**/*.js', ['scripts-dist']);
	gulp.watch('./index.html', ['copy-html']);
    gulp.watch('./dist/index.html').on('change', browserSync.reload);
    browserSync.init({
		server: './dist'
	});
});

gulp.task('scripts-dist', function() {
    gulp.src('js/**/*.js')
        // .pipe(concat('all.js'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('copy-html', function() {
    gulp.src('./index.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('styles', function() {
    gulp.src('css/**/*.css')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});