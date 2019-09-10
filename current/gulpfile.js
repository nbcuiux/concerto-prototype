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
        style: {
			l: 'src/styles/**/*-l.less',
			s: 'src/styles/**/*-s.less',
			a: 'src/styles/**/*-a.less',
			full: 'src/styles/**/*.less'
		},
        img: 'src/img/**/*.*',
        lib: 'src/lib/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/**/*.js*',
		style: {
			l: 'src/styles/**/*-l.less',
			s: 'src/styles/**/*-s.less',
			a: 'src/styles/**/*-a.less',
			full: 'src/styles/**/*.less'
		},
        img: 'src/img/**/*.*',
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
  	return gulp.src(path.src.style.full)
		.pipe(less())
		.pipe(concat('app.css'))
		.pipe(gulp.dest(path.build.style))
		.pipe(reload({stream: true}));
});
gulp.task('style:l', function() {
  	return gulp.src(path.src.style.l)
		.pipe(less())
		.pipe(concat('app-l.css'))
		.pipe(gulp.dest(path.build.style))
		.pipe(reload({stream: true}));
});
gulp.task('style:s', function() {
  	return gulp.src(path.src.style.s)
		.pipe(less())
		.pipe(concat('app-s.css'))
		.pipe(gulp.dest(path.build.style))
		.pipe(reload({stream: true}));
});
gulp.task('style:a', function() {
  	return gulp.src(path.src.style.a)
		.pipe(less())
		.pipe(concat('app-a.css'))
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

gulp.task('js', function () {
    return gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('browserify', function () {
    browserify('src/js/modules/main.js') // Browserify
    .transform(babel, {presets: ["es2015", "react"], compact: false})
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init()) //Инициализируем sourcemap
    .pipe(sourcemaps.write()) //Пропишем карты
    .pipe(gulp.dest(path.build.js))
});

gulp.task('build', ['html', 'browserify', 'js', 'style', 'style:l', 'style:s', 'style:a', 'image', 'vendor', 'fonts']);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html');
    });
    watch([path.watch.style.full], function(event, cb) {
        gulp.start('style');
    });
	watch([path.watch.style.l], function(event, cb) {
        gulp.start('style:l');
    });
	watch([path.watch.style.s], function(event, cb) {
        gulp.start('style:s');
    });
	watch([path.watch.style.a], function(event, cb) {
        gulp.start('style:a');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('browserify');
        gulp.start('js');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image');
    });
});

gulp.task('default', ['build', 'server', 'watch']);
