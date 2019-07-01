# RSA.ts
A tiny RSA implementation written in modern typescript, with tc39 bigint.
This module only relies on standard node.js libraries (Buffer, crypto & assert)

## **Disclaimer**
**This module is currently in developement.
No warranty provided whatsoever, use at your own risk.**

## Requirements
* Node.js >= 10.4 OR [a recent browser](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility)
* Typescript compiler

## Features
* Supports padding
    * OAEP 
    * raw
* Includes reusable maths library for tc39 bigints
* Supports Key Generations
    * Any keysize (default 1024)
    * Any public exponent (default: 0x10001)
* Only 9kB on nodejs