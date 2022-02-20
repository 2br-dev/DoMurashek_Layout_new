'use strict';

const gulp = require('gulp');
const babel=require('gulp-babel');
const gulp_sass = require('gulp-sass');
const node_sass = require('node-sass');
const sass = gulp_sass(node_sass);
const include = require('gulp-file-include');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const order = require('gulp-order');
const autoPrefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').init({
	server: {
		baseDir: './release/'
	}
});

gulp.task('main_include', function(){
	return gulp.src('./src/html/*.html')
		.pipe(include({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('./release/'))
		.pipe(browserSync.stream());
})

gulp.task('projects_include', function(){
	return gulp.src('./src/html/projects/*.html')
		.pipe(include({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('./release/projects'))
		.pipe(browserSync.stream());
})

gulp.task('luchiki_include', function(){
	return gulp.src('./src/html/projects/deti-luchiki/*.html')
		.pipe(include({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('./release/projects/deti-luchiki'))
		.pipe(browserSync.stream());
})

gulp.task('sass', function() {
	return gulp.src('./src/scss/**/*.scss')
		.pipe(sass({
			// outputStyle: 'compressed'
		}))
		.pipe(autoPrefixer())
		.pipe(gulp.dest('./release/css'))
		.pipe(browserSync.stream());
});

gulp.task('js', function(){
	return gulp.src('./src/js/*.js')
		.pipe(babel({
			presets: ["@babel/preset-env"]
		}))
		.pipe(concat('master.js'))
		.pipe(gulp.dest('./release/js/'))
		.pipe(browserSync.stream());
});

gulp.task('watch', function(){
	gulp.watch('./src/scss/**/*.scss', gulp.series('sass'));
	gulp.watch('./src/html/**/*.html', gulp.series(['main_include', 'projects_include', 'luchiki_include']));
	gulp.watch('./src/js/*.js', gulp.series('js'));
});