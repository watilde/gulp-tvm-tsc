gulp-tvm-tsc
============

Compile TypeScript files to JavaScript with TypeScript Version Manager.

## Usage
```js
var gulp = require('gulp');
var gutil = require('gulp-util');
var tsc = require('gulp-tvm-tsc');

gulp.task('tsc', function () {
  return gulp.src('test/*.ts')
    .pipe(tsc({
      version: '1.0.1', // default: latest
      option: '--target ES5 --removeComments'
    })).on('error', gutil.log)
    .pipe(gulp.dest('test/'))
  });
```
