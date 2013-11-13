
var assert = require('assert')
var details = require('../../../../lib/imageProcessing/processors/details')
var path = require('path')

var quip = {
  files: {}
}

describe('image details', function() {
  it('handles still images', function(done) {
    quip.files.original = path.join(__dirname, '../../../fixtures/images/still.gif')
    details(quip, function(err, details) {
      assert.ifError(err)
      assert.equal(details.original.type, 'JPEG')
      assert.strictEqual(details.original.width, 411)
      assert.strictEqual(details.original.height, 288)
      assert.strictEqual(details.original.frames, 1)
      done()
    })
  })
  it('handles animated images', function(done) {
    quip.files.original = path.join(__dirname, '../../../fixtures/images/animated.gif')
    details(quip, function(err, details) {
      assert.ifError(err)
      assert.equal(details.original.type, 'LZW')
      assert.strictEqual(details.original.width, 390)
      assert.strictEqual(details.original.height, 172)
      assert.strictEqual(details.original.frames, 64)
      assert.strictEqual(details.original.delay, 80)
      done()
    })
  })
})

