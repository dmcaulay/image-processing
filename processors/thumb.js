var config = require('config-heroku')
var im = require('imagemagick')
var path = require('path')
var getTempFile = require('../util').getTempFile

var thumb = function(quip, callback) {
  var file
  if (quip.meta.details.original.frames < 2) {
    file = quip.files.original
  } else {
    file = quip.files.split[0]
  }
  if (quip.meta.details.original.width <= config.imageProcessing.thumb.width) {
    quip.files.thumb = file
    return callback()
  }
  getTempFile(quip, 'thumb')
  im.resize({
    srcPath: file,
    dstPath: quip.files.thumb,
    width: config.imageProcessing.thumb.width
  }, function(err) {
    if (err) return callback(err, true)
    callback()
  })
}

module.exports = thumb
