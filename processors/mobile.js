var async = require('async')
var config = require('config-heroku')
var im = require('imagemagick')
var path = require('path')

var mobile = function(quip, callback) {
  var files
  if (quip.meta.details.original.frames < 2) {
    files = [quip.files.original]
  } else {
    files = quip.files.split
    ;delete quip.files.split
  }
  if (quip.meta.details.original.width <= config.imageProcessing.mobile.width) {
    quip.files.mobile = files
    return callback()
  }
  var output = []
  async.forEachSeries(files, function(f, done) {
    var ext = path.extname(f)
    var base = f.slice(0,-ext.length)
    var dest = base + '_mobile_' + ext
    output.push(dest)
    im.resize({
      srcPath: f,
      dstPath: dest,
      width: config.imageProcessing.mobile.width
    }, done)
  }, function(err) {
    if (err) return callback(err, true)
    quip.files.mobile = output
    quip.cleanup = quip.cleanup.concat(output)
    callback()
  })
}

module.exports = mobile
