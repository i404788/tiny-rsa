# RSA.ts
A tiny RSA implementation written in modern typescript, with tc39 bigint.
With (currently) 0 external dependencies.

## **Disclaimer**
**This module is currently in developement.
No warranty provided whatsoever, use at your own risk.**

## Features
* Supports padding
    * OAEP 
    * raw
* Includes reusable maths library for tc39 bigints
* Supports Key Generations
    * Any keysize (default 1024)
    * Any public exponent (default: 0x10001)


Uses/adapts components from:
* [Closure](https://github.com/google/closure-library) (Apache 2.0)
* [bigint-buffer](https://github.com/no2chem/bigint-buffer) (Apache 2.0)