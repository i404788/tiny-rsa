# Tiny RSA
A tiny RSA implementation written in pure typescript, with tc39 bigint.
This module only relies on standard node.js libraries (Buffer & crypto currently)

## Requirements
* Deno OR Node.js >= 10.4 OR [a recent browser](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility)

## Features
* Supports padding
    * OAEP (original)
    * PKCS#1-OAEP
    * Raw
* Includes reusable maths library for tc39 bigints
* Compressed releases on npm
* Supports Key Generations
    * Any keysize (default 1024)
    * Any public exponent (default: 0x10001)
* Tests
    * Optimized math library
    * ROCA tested
* Only 9.0kB on nodejs (3.7kB tarball)

## Basic Usage
```javascript
const rsa = require('tiny-rsa')

// This can take a few seconds
const key = rsa.generateKey(1024n)

// Uses OAEP padding with MGF1-sha256 (PKCS#1)
let ciphertext = rsa.Encrypt(Buffer.from("ABC"), key)

let plaintext = rsa.Decrypt(ciphertext, key)

console.log(plaintext.toString())
// Output: ABC
```
Docs coming soon(tm)

## Project structure
* src/ - Contains source code for tiny-rsa
* dist/ - Output after compiling tiny-rsa
* bench/ - Contains tests/benchmarks