var del = require('del'),
	gulp = require('gulp'),
	cache = require('gulp-cache'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
	cssnano = require('gulp-cssnano'),
	imagemin = require('gulp-imagemin'),
	livereload = require('gulp-livereload'),
	autoprefixer = require('gulp-autoprefixer');

// 源路径
var srcPaths = {
	scripts: ['./public/javascripts/*.js'],
	images: './public/images/*',
	styles: './public/stylesheets/*.css'
};

// 目标路径
var destPaths = {
	all: './build/**',
	scripts: './build/script',
	images: './build/image',
	styles: './build/style'
};

// 脚本代码验证
gulp.task('analysis', function() {
	return gulp.src(srcPaths.scripts)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(notify({message: 'Analysis task complete.'}));
});

// 1. 脚本合并与压缩
gulp.task('scripts', ['analysis'], function() {
	return gulp.src(srcPaths.scripts)
		.pipe(concat('main.js'))
		.pipe(gulp.dest(destPaths.scripts))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest(destPaths.scripts))
		.pipe(notify({message: 'Scripts task complete.'}));
});

// 2. 资源图片压缩
gulp.task('images', function() {
	return gulp.src(srcPaths.images)
		// 压缩 imagemin 并缓存 cache 图片
		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest(destPaths.images))
		.pipe(notify({message: 'Images task complete.'}));
});

// 3. 样式表的压缩
gulp.task('styles', function() {
	return gulp.src(srcPaths.styles)
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest(destPaths.styles))
		.pipe(rename({suffix: '.min'}))
		.pipe(cssnano())
		.pipe(gulp.dest(destPaths.styles))
		.pipe(notify({message: 'Styles task complete.'}));
});

// 清理构建目录
gulp.task('clean', function(cb) {
	// 清空 build 目录
	return del([destPaths.scripts, destPaths.images, destPaths.styles], cb);
});

// 默认任务
gulp.task('default', ['clean'], function() {
	gulp.start('scripts', 'images', 'styles');
});

// 监听文件变动
gulp.task('watch', function() {
	gulp.watch(srcPaths.scripts, ['scripts']);
	gulp.watch(srcPaths.images, ['images']);
	gulp.watch(srcPaths.styles, ['styles']);
});

// 监听自动刷新
gulp.task('watch', function() {
	// 创建 livereload 监听服务
	livereload.listen();
	// 若有改变就刷新
	gulp.watch([destPaths.all]).on('change', livereload.changed);
});


