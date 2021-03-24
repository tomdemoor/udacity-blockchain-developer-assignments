# Ethereumtx
ES5 compliant transaction builder for Ethereum

## Getting Started

This module allows to create, sign and verify raw transactions in Ethereum.

It also supports creating new accounts and transforming private keys to public keys and addresses.

This package was written to give an easy interface to manually creating Ethereum transactions, just like the bitcoin-cli does for Bitcoin.

### Installing

```
npm install ethereumtx
```

## Running the tests

```
npm test
```

# Example
```js
const ethtx = require('ethereumtx')

/*
  Create a new account with
  var account = ethtx.getnewaddress();
*/
var privateKey = '17d08f5fe8c77af811caa0c9a187e668ce3b74a99acc3f6d976f075fa8e0be55';

const txParams = {
  nonce: '0x4',
  gasPrice: '0x4a817c800',
  gasLimit: '0xdbba0',
  to: '0xd6e4caea206c9e58187cf129eeaa61b600b483bc',
  value: '0x4000'
};

var rawtx = ethtx.createrawtransaction(txParams);
console.log(rawtx);
/*
{ rawtransaction: 'e7048504a817c800830dbba094d6e4caea206c9e58187cf129eeaa61b600b483bc824000801c8080',
  chainId: 1 }
  // Mainnet chainId: 1 (default)
*/
var signedtx = ethtx.signrawtransaction(rawtx.rawtransaction, privateKey, rawtx.chainId);
console.log(signedtx);
/*
{ Signature:
   Signature {
     r: <BN: 910197c43da82517ad24882788d06428add58d6414c52fc712f432fb6067a36a>,
     s: <BN: 6165ea97f7d85d8403b1b4be07bf89d79980e48732a6c60e22b0f0a16270a6a9>,
     recoveryParam: 0 },
  signedTx: 'f867048504a817c800830dbba094d6e4caea206c9e58187cf129eeaa61b600b483bc8240008025a0910197c43da82517ad24882788d06428add58d6414c52fc712f432fb6067a36aa06165ea97f7d85d8403b1b4be07bf89d79980e48732a6c60e22b0f0a16270a6a9' }
*/
var validTransaction = ethtx.verifyrawtransaction(signedtx.signedTx, privateKey);
console.log(validTransaction);
/*
{ valid: true }
*/
var txParamDecoded = ethtx.decoderawtransaction(signedtx.signedTx);
console.log(txParamDecoded)
/*
{ nonce: '04',
  gasPrice: '04a817c800',
  gasLimit: '0dbba0',
  to: 'd6e4caea206c9e58187cf129eeaa61b600b483bc',
  value: '4000',
  data: '',
  v: '25',
  r: '910197c43da82517ad24882788d06428add58d6414c52fc712f432fb6067a36a',
  s: '6165ea97f7d85d8403b1b4be07bf89d79980e48732a6c60e22b0f0a16270a6a9' }
*/

```


# API Reference

**For all functions having chainId as parameter. The parameter is optional and defaults to 1. See [EIP155](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md)**

## createrawtransaction(txParams, [chainId])

Create a raw transaction using the given transaction parameters and the chainId.

**Parameters**

-   `txParams` **JSON**
-   `privateKey` **string**
-   `chainId` **integer** (Optional, defaults to 1), can get overridden if the **v** value of the *txParams* is set, read EIP 155

**Returns**
- JSON including the raw transaction and the chain id

Example
```
{ rawtransaction: 'e7048504a817c800830dbba094d6e4caea206c9e58187cf129eeaa61b600b483bc824000801c8080',
  chainId: 1 }
```

## decoderawtransaction(tx)

Decodes raw transaction back to json with transaction parameters

**Parameters**

- `tx` **string** raw transaction

**Returns**
- JSON with transaction parameters

Example
```
{ nonce: '04',
  gasPrice: '04a817c800',
  gasLimit: '0dbba0',
  to: 'd6e4caea206c9e58187cf129eeaa61b600b483bc',
  value: '4000',
  data: '',
  v: '25',
  r: '910197c43da82517ad24882788d06428add58d6414c52fc712f432fb6067a36a',
  s: '6165ea97f7d85d8403b1b4be07bf89d79980e48732a6c60e22b0f0a16270a6a9' }
```

## signrawtransaction(tx, privateKey, [chainId])

Sign a raw transaction with a given private key.
The transaction is going to be deployed on a network with id chainId. (See EIP155)

**Parameters**

-   `tx` **string**
-   `privateKey` **string**
-   `chainId` **integer** (Optional, defaults to 1)

**Returns**

- JSON with 'signature' and 'signedTx' (signed transaction)

Example
```
{ Signature:
   Signature {
     r: <BN: 910197c43da82517ad24882788d06428add58d6414c52fc712f432fb6067a36a>,
     s: <BN: 6165ea97f7d85d8403b1b4be07bf89d79980e48732a6c60e22b0f0a16270a6a9>,
     recoveryParam: 0 },
  signedTx: 'f867048504a817c800830dbba094d6e4caea206c9e58187cf129eeaa61b600b483bc8240008025a0910197c43da82517ad24882788d06428add58d6414c52fc712f432fb6067a36aa06165ea97f7d85d8403b1b4be07bf89d79980e48732a6c60e22b0f0a16270a6a9' }
```

## verifyrawtransaction(tx, privateKey, [chainId])

Verifies that a transaction *tx* was signed with private key *privateKey*.
On failure it also returns the error.

**Parameters**

-   `tx` **string**
-   `privateKey` **string**
-   `chainId` **integer** (Optional, defaults to 1)

**Returns**
JSON with fields 'valid' and 'error'

Examples
```
{'valid': true, 'error': ''}
{'valid': false, 'error': 'Not signed by privateKey: 17d08f5fe8c77af811caa0c9a187e668ce3b74a99acc3f6d976f075fa8e0be55'}
```

## getnewaddress()

Generates a new pseudorandom private key, public key and address

**Returns**

Example
```
{ privateKey: 'f29bffee46a37afaf549bfcd0f6166a55042de53ff8261e1b2eace48b5e39c91',
  publicKey: '2f65b9d0c967b623a9d3de5dc405d4a0133f60be6af7751d1b0ac112bb3180c045633c1dbfce97bc02f87cd441e5eed9be52605520b7fd7a4beab9641313ac82',
  address: '27eda7afbbb3694e0a5a1af0a93d583a35c31273' }
```

## privateToPublic(privateKey)

Converts private key to public

**Parameters**

-   `privateKey` **string**

**Returns**

-   `publicKey` **string**

## publicToAddress(pubKey)

Converts public key to address

**Parameters**

-   `publicKey` **string**

**Returns**

-   `address` **string**

## getFields()

Returns the fields of a transaction

## Authors

* **Panayiotis Panayiotou** - [panpan2](https://github.com/panpan2)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
