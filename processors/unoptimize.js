var async = require('async')
var getTempFile = require('../util').getTempFile
var path = require('path')
var exec = require('child_process').exec

var unoptimize = function(quip, callback) {
  getTempFile(quip, 'unoptimized')
  var gifsicle = exec('gifsicle --unoptimize < '+quip.files.original+' > '+quip.files.unoptimized)
  gifsicle.on('close',function(code) {
    if (code != 0) return callback(new Error('gifsicle error'))
    callback()
  })
}

module.exports = unoptimize
