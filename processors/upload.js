var async = require('async')
var config = require('config-heroku')
var client = require('knox').createClient(config.amazon)

var getUniqueName = function(key) {
  return key === 'original' ? '' : '_' + key.slice(0,1)
}

var upload = function(quip, callback) {
  var baseFileName = 'quips/' + quip.id.toString()
  var keys = Object.keys(quip.files)
  async.forEach(keys, function(key, done) {
    var isArray = Array.isArray(quip.files[key])
    var files = isArray ? quip.files[key] : [ quip.files[key] ]
    var i = 0
    async.forEach(files, function(file, done) {
      var fileName = baseFileName + (isArray ? ('_' + i++) : getUniqueName(key))
      var progress = client.putFile(file, fileName, {'x-amz-acl':'public-read','Content-Type':quip.mime}, function(err,res){
        if(err) return done(err)
        res.on('end', done).on('error', done)
      })
      progress.on('progress', console.log.bind(this, 'progress', file))
    }, done)
  }, function(err) {
    if (err) return callback(err, true)
    callback()
  })
}

module.exports = upload
