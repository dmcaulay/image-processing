var config = require('config-heroku').imageProcessing.details
var async = require('async')
var im = require('imagemagick')

var details = function(quip, callback) {
  var keys = Object.keys(quip.files)
  async.map(keys, function(key, done) {
    var isArray = Array.isArray(quip.files[key])
    var file = isArray ? quip.files[key][0] : quip.files[key]
    im.identify(["-format", "%C,%w,%h,%n,%T\n", file], function(err, output) {
      if (err) return done(err)
      var format = output.split(',')
      var details = {
        type: format[0],
        width: +format[1],
        height: +format[2],
        frames: isArray ? quip.files[key].length : parseInt(format[3], 10),
        delay: parseInt(format[4], 10) * 10, // convert from cs to ms
        output: output
      }
      if (details.width < config.minWidth || details.Height < config.minHeight) return done(new Error('invalid image'))
      done(null, details)
    })
  }, function(err, info) {
    if (err) {
      if (err.message === 'invalid image') return callback(new Error('invalid image'))
      return callback(err, true)
    }
    var res = {}
    keys.forEach(function(key, i) {
      res[key] = info[i]
    })
    callback(null, res)
  })
}

module.exports = details
