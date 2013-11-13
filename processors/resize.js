var async = require('async')
var config = require('config-heroku')
var getTempFile = require('../util').getTempFile
var im = require('imagemagick')
var path = require('path')

var resize = function(quip, callback) {
  if (quip.meta.details.original.frames > 1) return callback() // ignore animated gifs here
  if (quip.meta.details.original.width <= config.imageProcessing.resize.width) {
    return callback()
  }
  getTempFile(quip, 'resize')
  im.resize({
    srcPath: quip.files.original,
    dstPath: quip.files.resize,
    width: config.imageProcessing.resize.width
  }, function(err) {
    if (err) return callback(err, true)
    quip.files.original = quip.files.resize
    ;delete quip.files.resize
    callback()
  })
}

module.exports = resize
