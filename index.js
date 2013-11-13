var async = require('async')
var config = require('config-heroku')
var db = require('../mongoWrapper').db.add('quips')
var ObjectID = require('../mongoWrapper').ObjectID
var EventEmitter = require('events').EventEmitter
var fs = require('fs')
var path = require('path')
var mime = require('mime')
var Queue = require('../queue').MemoryQueue
var request = require('request')
var getTempFile = require('./util').getTempFile

// Local Vars
var queue = new Queue('imageProcessing',config.imageProcessing.maxConcurrent, processQuip)
var emitter = new EventEmitter()

var enqueueQuip = function(options, callback) {
  if (!options.quip) return callback(new Error('must send the quip to enqueue an image'))
  var quip = { id: options.quip._id.toString(), mime: options.mime, processors: config.imageProcessing.processors, stage: 0, meta: {} }
  var readStream
  if (options.file) readStream = fs.createReadStream(options.file)
  else if (options.url) readStream = request(options.url)
  storeTemp(quip, readStream, function(err) {
    callback(err)
    if (err) return console.log('error storing temp file!', err)
    queue.enqueue(quip, function(err) {
      if (err) console.log('error enqueuing quip for image processing', err)
    })
  })
}

function processQuip(quip, callback) {
  if (quip.stage >= quip.processors.length) return completeQuip(quip, callback)
  var current = quip.processors[quip.stage]
  emitter.emit('progress', quip.id, current, quip.stage/quip.processors.length)
  // console.log('starting',quip.id,current)
  processors[current](quip, function(err, res) {
    if (err) {
      console.log('error processing quip', quip.id, current, err)
      quip.errors = quip.errors || 0
      quip.errors++
      // if we have an error res needs to be true inorder to retry
      if (!res || quip.errors >= config.imageProcessing.maxErrors) {
        quip.meta.failed = true
        return completeQuip(quip, callback) // we're giving up
      }
    } else {
      if (res) {
        quip.meta[current] = res
      }
      quip.stage++
    }
    processQuip(quip, callback) // move to the next task
  })
}

var completeQuip = function(quip, callback) {
  async.parallel([
    cleanup.bind(null, quip),
    updateDb.bind(null, quip)
  ], function(err) {
    emitter.emit('progress', quip.id, quip.meta.faild ? 'failed' : 'complete', 1)
    if (err) console.log('error cleaning up quip', quip.id, err)
    callback()
  })
}

var storeTemp = function(quip, readStream, callback) {
  var temp_file = getTempFile(quip)
  var writeStream = fs.createWriteStream(temp_file)
  readStream.pipe(writeStream).on('close', callback).on('error', callback)
  if (!quip.mime) {
    readStream.on('response', function(response) {
      if (response.headers) {
        quip.mime = response.headers['content-type']
      } else if (readStream.path) {
        quip.mime = mime.lookup(readStream.path)
      }
    })
  }
  readStream.on('error',callback)
}

var cleanup = function(quip, callback) {
  async.forEachSeries(quip.cleanup, function(f, done) {
    fs.exists(f, function(exists) {
      if (exists) fs.unlink(f, done)
      else done()
    })
  }, callback)
}

var updateDb = function(quip, callback) {
  if (quip.meta.failed) {
    db.quips.update({_id: new ObjectID(quip.id)}, {$set: {'meta.status':'failed'}}, callback)
  } else {
    db.quips.update({_id: new ObjectID(quip.id)}, {$set: {'meta.status':'ready','meta.animated':quip.meta.details.original.frames > 1,'meta.image_details':quip.meta.details}}, callback)
  }
}

var processors = {
  details : require('./processors/details'),
  split : require('./processors/split'),
  thumb : require('./processors/thumb'),
  mobile : require('./processors/mobile'),
  resize : require('./processors/resize'),
  upload : require('./processors/upload')
}

module.exports = {
  enqueueQuip: enqueueQuip,
  events: emitter
}

