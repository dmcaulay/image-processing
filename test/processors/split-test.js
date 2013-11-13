
var async = require('async')
var assert = require('assert')
var fs = require('fs')
var split = require('../../../../lib/imageProcessing/processors/split')
var path = require('path')

var quip = {
  files: {},
  meta: { details: { original: { }  } },
  cleanup: []
}

describe('image details', function() {
  it('handles still images', function(done) {
    quip.files.original = path.join(__dirname, '../../../fixtures/images/still.gif')
    quip.meta.details.original.frames = 1
    split(quip, function(err) {
      assert.ifError(err)
      assert.strictEqual(quip.meta.split, undefined)
      done()
    })
  })
  it('handles animated images', function(done) {
    quip.files.original = path.join(__dirname, '../../../fixtures/images/animated.gif')
    quip.meta.details.original.frames = 64
    split(quip, function(err) {
      assert.ifError(err)
      assert.deepEqual(quip.cleanup, quip.files.split)
      async.forEach(quip.files.split, function(f, done) {
        fs.exists(f, function(exists) {
          assert(exists)
          fs.unlink(f,done)
        })
      }, done)
    })
  })
})

