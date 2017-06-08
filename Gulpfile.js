var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    extractor   = require('gulp-extract-sourcemap');

gulp.task('browserify', function () {
    return gulp.src(['./js/app.js'])
        .pipe(browserify({
            debug: true,
			paths: ['./js']
        }).on('error', function (e) {
            console.log(e);
        }))
        .pipe(extractor())
        .on('error', function () {
            console.error('error');
            this.emit('end');
        })
        .pipe(gulp.dest('./build'));
});

gulp.task('default', ['browserify'], function () {
    gulp.watch('js/*.js', ['browserify']);
});
