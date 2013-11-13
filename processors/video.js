var async = require('async')
var util = require('../util')
var path = require('path')
var exec = require('child_process').exec

var video = function(quip, callback) {
  util.getTempFile(quip, 'video', '.mp4')
  var framerate = 1000/(quip.meta.details.original.delay || 100)
  var splitFiles = util.splitFileFormat(quip)
  exec('ffmpeg -framerate '+framerate+' -i '+splitFiles.file+' -vf "crop=((in_w/2)*2):((in_h/2)*2)" -f mp4 -vcodec libx264 '+quip.files.video, function(err,stdout,stderr) {
    if (err) return callback(err)
    callback()
  })
}

module.exports = video
