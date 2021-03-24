/* Import libraries */
var EC = require('elliptic').ec;
const rlp = require('rlp');
const keccak = require('keccakjs')
var crypto = require('crypto');
const BN = require('bn.js');


/* Helpers */
const txFields = [{
  name: 'nonce',
  default: new Buffer([])
}, {
  name: 'gasPrice',
  default: new Buffer([])
}, {
  name: 'gasLimit',
  default: new Buffer([])
}, {
  name: 'to',
  default: new Buffer([])
}, {
  name: 'value',
  default: new Buffer([])
}, {
  name: 'data',
  default: new Buffer([])
}, {
  name: 'v',
  default: new Buffer([0x1c])
}, {
  name: 'r',
  default: new Buffer([])
}, {
  name: 's',
  length: 32,
  default: new Buffer([])
}]

const V_INDEX = 6;
const R_INDEX = 7;
const S_INDEX = 8;
const secp256k1nDIV2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16);

function safeBufferize(param) {
  if (param.length % 2 == 1) {
    param = '0' + param;
  }
  return Buffer.from(param, 'hex');
}

function serialize(raw) {
  return rlp.encode(raw).toString('hex');
}

function txhash(raw, chainId, includeSignature) {
  if (includeSignature === undefined) {
    includeSignature = false;
  }
  if (chainId === undefined) {
    chainId = 1;
  }

  // EIP155 spec:
  // when computing the hash of a transaction for purposes of signing or recovering,
  // instead of hashing only the first six elements (ie. nonce, gasprice, startgas, to, value, data),
  // hash nine elements, with v replaced by CHAIN_ID, r = 0 and s = 0

  var data;
  if (includeSignature) {
    data = raw
  } else {
    if (chainId > 0) {
      data = raw.slice()
      data[V_INDEX] = safeBufferize(chainId.toString(16));
      data[R_INDEX] = new Buffer([])
      data[S_INDEX] = new Buffer([])
    } else {
      data = raw.slice(0, V_INDEX);
    }
  }

  var rlpdata = rlp.encode(data);
  var keccakHash = new keccak(256)
  keccakHash.update(rlpdata)

  return safeBufferize(keccakHash.digest('hex'));
}

function publicToAddress(pubKey) {
  pubKey = safeBufferize(pubKey)

  if (pubKey.length !== 64) {
    throw new Error("Public key length should be 64 bytes");
  }
  // Lower 20 bytes of the hash
  var keccakHash = new keccak(256);
  keccakHash.update(pubKey);
  return keccakHash.digest('hex').slice(-40);
}

function privateToPublic(privateKey) {
  /* Remove 0x prefix if possible */
  if (privateKey[1] == 'x') {
    privateKey = privateKey.substr(2);
  }

  privateKey = safeBufferize(privateKey);

  if (privateKey.length !== 32) {
    throw new Error("Private key length should be 32 bytes");
  }

  var ec = new EC('secp256k1');
  var key = ec.keyFromPrivate(privateKey, 'hex');
  return key.getPublic().encode('hex').substr(2);
}


/* Exports */
/* No support for ICAP Direct yet */
module.exports.getnewaddress = function () {
  var privateKey = crypto.randomBytes(32);
  var publicKey = privateToPublic(privateKey);
  var address = publicToAddress(publicKey);
  return {
    'privateKey': privateKey.toString('hex'),
    'publicKey': publicKey,
    'address': address
  }
}

module.exports.privateToPublic = privateToPublic;

module.exports.publicToAddress = publicToAddress;

module.exports.getFields = function () {
  return [ 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'data', 'v', 'r', 's' ];
}

/* txParamChainId can get overriden if v value of the txParams is set, read EIP 155 */
module.exports.createrawtransaction = function (txParams, txParamChainId) {
  raw = [];
  for (var i = 0; i < txFields.length; i++) {
    var key = txFields[i].name;
    if (txParams[key] === undefined) {
      raw.push(txFields[i].default);
    } else {
      raw.push(safeBufferize(txParams[key].substr(2)));
    }
  }

  var sigV = parseInt('0x' + raw[V_INDEX].toString('hex'), 'hex')
  var chainId = Math.floor((sigV - 35) / 2);

  if (chainId < 0) {
    if (txParamChainId !== undefined) {
      chainId = txParamChainId;
    } else {
      chainId = 0;
    }
  }

  return {
    'rawtransaction': serialize(raw),
    'chainId': chainId
  };

}

module.exports.decoderawtransaction = decoderawtransaction;

function decoderawtransaction (tx) {
  var raw = rlp.decode(safeBufferize(tx));
  var txParams = {};
  for (var i = 0; i < txFields.length; i++) {
    txParams[txFields[i].name] = raw[i].toString('hex');
  }
  return txParams;
}

module.exports.signrawtransaction = function (tx, privateKey, chainId) {
  /* Default value */
  if (chainId === undefined) {
    chainId = 1;
  }

  /* rlp encode and hash the transaction data first */
  var raw = rlp.decode(safeBufferize(tx));
  var msgHash = txhash(raw, chainId);

  if (privateKey[1] == 'x') {
    privateKey = privateKey.substr(2);
  }

  var ec = new EC('secp256k1');
  var key = ec.keyFromPrivate(privateKey, 'hex');
  var sig = key.sign(msgHash, {canonical: true});

  var recov = sig.recoveryParam + 27;
  raw[V_INDEX] = safeBufferize(recov.toString(16));
  raw[R_INDEX] = safeBufferize(sig.r.toString(16));
  raw[S_INDEX] = safeBufferize(sig.s.toString(16));

  if (chainId > 0) {
    var newrecov = recov + chainId * 2 + 8;
    raw[V_INDEX] = safeBufferize(newrecov.toString(16));
  }

  return {'Signature': sig, 'signedTx': serialize(raw)};
}


module.exports.verifyrawtransaction = function (tx, privateKey, chainId) {
  /* Default value */
  if (chainId === undefined) {
    chainId = 1;
  }

  var msgHash = txhash(rlp.decode(safeBufferize(tx)), chainId);
  var decodedtx = decoderawtransaction(tx);

  // s-value should be less than secp256k1n / 2
  if (new BN(decodedtx.s, 16).cmp(secp256k1nDIV2) === 1) {
    return {'valid': false, 'error': 'Invalid Signature'};
  }

  let v = new BN(decodedtx.v, 16);
  if (chainId > 0) {
    v -= chainId * 2 + 8
  }
  if (v !== 27 && v !== 28) {
    throw new Error('Invalid signature v value')
  }

  var ec = new EC('secp256k1');
  var key = ec.keyFromPrivate(privateKey, 'hex');
  const signature = Buffer.concat([Buffer.from(decodedtx.r, 'hex'), Buffer.from(decodedtx.s, 'hex')], 64);
  if (key.verify(msgHash, { r: decodedtx.r, s: decodedtx.s }, {canonical: true})) {
    return {'valid': true, 'error': ''};
  }
  return {'valid': false, 'error': 'Not signed by privateKey: ' + privateKey};
}
