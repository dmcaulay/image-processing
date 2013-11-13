
var async = require('async')
var assert = require('assert')
var fs = require('fs')
var video = require('../../../../lib/imageProcessing/processors/video')
var path = require('path')

var quip = {
  id: 'test',
  files: {},
  meta: { details: { original: { }  } }
}

describe('video', function() {
  // it('handles animated images', function(done) {
  //   quip.files.original = path.join(__dirname, '../../../fixtures/images/split.gif')
  //   quip.meta.details.original.delay = 80
  //   video(quip, function(err) {
  //     assert.ifError(err)
  //     done()
  //   })
  // })
})

