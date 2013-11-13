var config = require('config-heroku')
var mkdirp = require('mkdirp')
var path = require('path')
var tmpdir = path.resolve(config.tmpdir)
mkdirp.sync(config.tmpdir)

var getTempFile = function(quip, type) {
  type = type || 'original'
  quip.files = quip.files || {}
  quip.cleanup = quip.cleanup || []
  if (!quip.files[type]) {
    // imagemagick needs an extension, seems to recognize all types even if extension is .gif
    quip.files[type] = path.join(tmpdir, quip.id + '_' + type + '_' + (new Date()).getTime()) + '.gif'
  }
  quip.cleanup.push(quip.files[type])
  return quip.files[type]
}

module.exports = {
  getTempFile: getTempFile
}
