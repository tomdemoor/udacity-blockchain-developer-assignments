# hmac

pure js hmac that can be used with any create hash function.

## example

``` js
var Blake2s = require('blake2s')
function createBlake2s () {
  return new Blake2s()
}
var createHmac = require('hmac')
  .bind(null, createBlake2s, 64)

var hmac = createHmac('key 123')

var mac = hmac.update('foo', 'utf8').digest('hex')
```

tested with sha family algorithms against node's crypto lib,
and produces correct hashes.

## api: createHmac(createHash, len, key)

where `createHash` is a function that returns `{update(), digest()}` object
and len is either 128 or 64 (sha1, sha224, sha256 use 64,
and sha384, sha512 use 128)

`key` is the key (secret) to the hmac.

see also [crypto.createHmac()](http://nodejs.org/api/crypto.html#crypto_crypto_createhmac_algorithm_key)

## License

MIT
