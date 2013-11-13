
var async = require('async')
var assert = require('assert')
var fs = require('fs')
var mobile = require('../../../../lib/imageProcessing/processors/mobile')
var path = require('path')

var quip = {
  id: 'test',
  files: {},
  meta: { details: { original: { }  } },
  cleanup: []
}

describe('image details', function() {
  it('handles still images', function(done) {
    quip.files.original = path.join(__dirname, '../../../fixtures/images/still.gif')
    quip.meta.details.original.frames = 1
    quip.meta.details.original.width = 411
    mobile(quip, function(err) {
      assert.ifError(err)
      assert.deepEqual(quip.cleanup, quip.files.mobile)
      async.forEach(quip.files.mobile, function(f, done) {
        fs.exists(f, function(exists) {
          assert(exists)
          fs.unlink(f,done)
        })
      }, done)
    })
  })
  it('handles animated images', function(done) {
    quip.files.split = [path.join(__dirname, '../../../fixtures/images/still.gif')]
    quip.meta.details.original.frames = 64
    quip.meta.details.original.width = 411
    quip.cleanup = []
    mobile(quip, function(err) {
      assert.ifError(err)
      assert.deepEqual(quip.cleanup, quip.files.mobile)
      assert.strictEqual(quip.split, undefined)
      async.forEach(quip.files.mobile, function(f, done) {
        fs.exists(f, function(exists) {
          assert(exists)
          fs.unlink(f,done)
        })
      }, done)
    })
  })
})

