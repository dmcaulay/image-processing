var im = require('imagemagick')
var path = require('path')

var split = function(quip, callback) {
  if (quip.meta.details.original.frames < 2) return callback() // only do this if it's animated
  var ext = path.extname(quip.files.original)
  var base = quip.files.original.slice(0,-ext.length)
  var splitFiles = base + '_%03d' + ext
  im.convert([quip.files.original,"+adjoin",splitFiles], function(err) {
    if (err) return callback(err, true)
    var files = quip.files.split = []
    for (var i=0; i<quip.meta.details.original.frames; i++) {
      files.push(base + '_' + ('000'+i).slice(-3) + ext)
    }
    quip.cleanup = quip.cleanup.concat(files)
    callback()
  })
}

module.exports = split
