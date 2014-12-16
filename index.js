'use strict';
var fs = require('fs');
var async = require('async');
var gutil = require('gulp-util');
var merge = require('merge');
var tmpWrite = require('temp-write');
var through = require('through2');
var tvm = require('tvm');
var PluginError = gutil.PluginError;

module.exports = function (opt) {
  var options = merge({
    option: '',
    version: 'latest'
  }, opt);

  function transform(file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new PluginError(
        'gulp-tvm-tsc', 'Streaming not supported'
      ));
    }

    var data;
    var str = file.contents.toString('utf8');
    var dest = gutil.replaceExtension(file.path, '.js');
    var tmpFile = tmpWrite.sync(str);
    var outFile = tmpWrite.sync('');

    // Add extension for tsc compiler required
    fs.renameSync(tmpFile, tmpFile + '.ts');
    fs.renameSync(outFile, outFile + '.js');
    tmpFile += '.ts';
    outFile += '.js';

    async.waterfall([function (callback) {
      tvm.install(options.version, callback);
    }, function (callback) {
      tvm.use(options.version, callback);
    }, function (callback) {
      tvm.tsc(options.option + ' ' + tmpFile + ' --out ' + outFile, callback);
    }, function () {
      file.contents = fs.readFileSync(outFile);
      file.path = dest;

      // Remove tmp files
      fs.unlinkSync(outFile);
      fs.unlinkSync(tmpFile);

      // Finish stream
      cb(null, file);
    }]);
  }

  return through.obj(transform);
};
