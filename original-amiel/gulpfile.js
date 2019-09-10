/* global require */

var gulp = require('gulp'),
browserSync = require('browser-sync'),
reload = browserSync.reload,
concat = require('gulp-concat'),
rigger = require('gulp-rigger'),
sourcemaps = require('gulp-sourcemaps'),
buffer = require('vinyl-buffer');
less = require('gulp-less'),
watch = require('gulp-watch'),
browserify = require('browserify'),
babel = require('babelify'),
source = require('vinyl-source-stream'),
fs = require("fs");


var srcLess = [
	"src/styles/mixins.less",
	"src/styles/*.less",
	"src/styles/font-awesome/font-awesome.less",
	"src/styles/blog/**/*.less",
	"src/styles/cards/**/*.less",
	"src/styles/components/**/*.less",
	"src/styles/content/**/*.less",
	"src/styles/content-filter/**/*.less",
	"src/styles/content-library/**/*.less",
	"src/styles/controls/**/*.less",
	"src/styles/dragfiles/**/*.less",
	"src/styles/dropdown/**/*.less",
	"src/styles/files/**/*.less",
	"src/styles/image-style/**/*.less",
	"src/styles/images/**/*.less",
	"src/styles/modal/**/*.less",
	"src/styles/notifications/**/*.less",
	"src/styles/section/**/*.less",
	"src/lib/tinymce/js/tinymce/skins/concerto/skin.dev.less"
]

var path = {
	build: { //Тут мы укажем куда складывать готовые после сборки файлы
		html: 'build/',
		js: 'build/js/',
		style: 'build/',
		img: 'build/img/',
		lib: 'build/lib/',
		fonts: 'build/fonts/'
	},
	src: { //Пути откуда брать исходники
		html: 'src/html/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
		js: 'src/js/*.js',//В стилях и скриптах нам понадобятся только main файлы
		style: srcLess,
		tinymceskin: 'src/lib/tinymce/js/tinymce/skins/concerto/skin.dev.less',
		img: 'src/img/**/*.*',
		lib: 'src/lib/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
		html: 'src/**/*.html',
		js: ['src/**/*.js', 'src/**/*.jsx'],
		style: 'src/styles/**/*.less',
		img: 'src/img/**/*.*',
        jsx: 'src/js/components/*.jsx',//В стилях и скриптах нам понадобятся только main файлы
	},
	clean: './build'
};

gulp.task('server', function() {
	browserSync.init({server: {
		baseDir: path.build.html
	}
});
});

gulp.task('html', function () {
	return gulp.src(path.src.html) //Выберем файлы по нужному пути
	.pipe(rigger()) //Прогоним через rigger
	.pipe(gulp.dest(path.build.html)) //И перезагрузим наш сервер для обновлений
	.pipe(reload({stream: true}));
});

gulp.task('style', function() {
	return gulp.src(path.src.style)
	.pipe(less())
	.pipe(concat('app.css'))
	.pipe(gulp.dest(path.build.style))
	.pipe(reload({stream: true}));
});

gulp.task('image', function () {
	return gulp.src(path.src.img)
	.pipe(gulp.dest(path.build.img))
	.pipe(reload({stream: true}));
});
gulp.task('fonts', function () {
	return gulp.src(path.src.fonts)
	.pipe(gulp.dest(path.build.fonts))
	.pipe(reload({stream: true}));
});
gulp.task('vendor', function () {
	return gulp.src(path.src.lib)
	.pipe(gulp.dest(path.build.lib))
	.pipe(reload({stream: true}));
});

gulp.task('browserify', function () {
	browserify('src/js/main.js') // Browserify
	.transform(babel, {presets: ["es2015", "react"], compact: false})
	.bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init()) //Инициализируем sourcemap
	.pipe(sourcemaps.write()) //Пропишем карты
	.pipe(gulp.dest(path.build.js))
});

gulp.task('js', function () {
	gulp.src(path.src.js) //Найдем наш main файл
	.pipe(rigger()) //Прогоним через rigger
	.pipe(sourcemaps.init()) //Инициализируем sourcemap
	.pipe(sourcemaps.write()) //Пропишем карты
	.pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
	.pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('build', ['html', 'browserify', 'js', 'style', 'image', 'vendor', 'fonts']);

gulp.task('watch', function(){
	watch([path.watch.html], function(event, cb) {
		gulp.start('html');
	});
	watch([path.watch.style], function(event, cb) {
		gulp.start('style');
	});
	watch(path.watch.js, function(event, cb) {
        gulp.start('browserify');
		gulp.start('js');
	});
    watch([path.watch.jsx], function(event, cb) {
        gulp.start('browserify');
    });
	watch([path.watch.img], function(event, cb) {
		gulp.start('image');
	});
});

gulp.task('default', ['build', 'server', 'watch']);
