async = require('async')
through = require('through2')
gutil = require('gulp-util')
tvm = require('tvm')
PluginError = gutil.PluginError

module.exports = (opt) =>
  func = (file, enc, callback) =>
    opt = opt || {}
    version = opt.version || 'latest'
    console.log "Yo: " + version

    return async.waterfall(
      (_callback) =>
        tvm.install(version, _callback)
      (_callback) =>
        tvm.use(version, _callback)
      () =>
        # if file.isNull()
        # Do nothing if no contents
        if file.isBuffer()
          str = file.contents.toString('utf8')
          data = tvm.tsc(str)
          file.contents = new Buffer(data)

        if file.isStream()
          file.contents = file.contens.pipe(tvm.tsc(file.contents))
          this.push(file)

        return callback()
    )
  stream  = through.obj(func)
  return stream