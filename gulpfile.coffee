fs = require('fs')
gulp = require('gulp')
rename = require('gulp-rename')
tsc = require('./index')

gulp.task('tsc', () =>
  return gulp.src('test/main.ts')
    .pipe(tsc({version: '1.0.1'}))
    .pipe(rename('main.js'))
    .pipe(gulp.dest('test/'))
)