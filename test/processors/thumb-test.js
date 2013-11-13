
var async = require('async')
var assert = require('assert')
var fs = require('fs')
var thumb = require('../../../../lib/imageProcessing/processors/thumb')
var path = require('path')

var quip = {
  id: 'test',
  files: {},
  meta: { details: { original: { }  } }
}

describe('image details', function() {
  it('handles still images', function(done) {
    quip.files.original = path.join(__dirname, '../../../fixtures/images/still.gif')
    quip.meta.details.original.frames = 1
    quip.meta.details.original.width = 288
    thumb(quip, function(err) {
      assert.ifError(err)
      fs.exists(quip.files.thumb, function(exists) {
        assert(exists)
        fs.unlink(quip.files.thumb,done)
      })
    })
  })
  it('handles animated images', function(done) {
    quip.files.split = [path.join(__dirname, '../../../fixtures/images/still.gif')]
    quip.meta.details.original.frames = 64
    quip.meta.details.original.width = 288
    thumb(quip, function(err) {
      assert.ifError(err)
      fs.exists(quip.files.thumb, function(exists) {
        assert(exists)
        fs.unlink(quip.files.thumb,done)
      })
    })
  })
})

