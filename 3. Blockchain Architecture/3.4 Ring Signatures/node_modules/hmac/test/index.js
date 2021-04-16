

var tape = require('tape')
var crypto = require('crypto')

var createHmac = require('../')

function createTest(alg, len) {
  tape('hmac is compatible with node', function (t) {

    for(var i = 1; i < 1024; i += 7) {
      var b = crypto.randomBytes(i)

      var createSha256 = crypto.createHash.bind(null, alg)
      var hmac = createHmac(createSha256, len, 'test 123')
      var _hmac = crypto.createHmac(alg, 'test 123')
      hmac.update(b)
      _hmac.update(b)

      t.deepEqual(hmac.digest(), _hmac.digest())
    }
    t.end()

  })
}

createTest('sha1', 64)
createTest('sha224', 64)
createTest('sha256', 64)
createTest('sha384', 128)
createTest('sha512', 128)


