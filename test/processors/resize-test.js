
var async = require('async')
var assert = require('assert')
var fs = require('fs')
var resize = require('../../../../lib/imageProcessing/processors/resize')
var path = require('path')

var quip = {
  id: 'test',
  files: {},
  meta: { details: { original: { }  } }
}

describe('image details', function() {
  it('handles still images', function(done) {
    quip.files.original = path.join(__dirname, '../../../fixtures/images/resize.jpg')
    quip.meta.details.original.frames = 1
    quip.meta.details.original.width = 1200
    resize(quip, function(err) {
      assert.ifError(err)
      fs.exists(quip.files.original, function(exists) {
        assert(exists)
        fs.unlink(quip.files.original,done)
      })
    })
  })
  it('handles animated images', function(done) {
    quip.meta.details.original.frames = 64
    quip.meta.details.original.width = 1200
    resize(quip, function(err) {
      assert.ifError(err)
      done()
    })
  })
})

