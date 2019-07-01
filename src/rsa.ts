import assert from 'assert';
import { OAEP_Pad, OAEP_Unpad } from "./pad";
import { randomPrime, isqrt, modmulinv, abs, lcm, gcd, powmod, bitLength } from "./math";
import { BuffertoBigIntBE, BigInttoBufferBE } from './encode';

/// Begin Region KeyGen

export function Key(opt: {egen?: string, lambdaNf?: string, keysize?: number}) {
    let opts = {
        egen: 'standard',
        lambdaNf: 'lcm',
        keysize: 1024
    }
    Object.assign(opts, opt)
    let e = opts.egen === 'standard' ? 65537n:
        opts.egen === 'small' ? randomPrime(20) :
            opts.egen === 'big' ? randomPrime(64) : // TODO: adjust probability
                randomPrime(32) // default
    let p
    let q
    let lambda_n
    do {
        p = randomPrime(opts.keysize / 2) // TODO: Change to more secure default
        q = randomPrime(opts.keysize / 2)
        lambda_n = opts.lambdaNf === 'totient' ? (p - 1n) * (q - 1n) : lcm(p - 1n, q - 1n)
    } while (gcd(e, lambda_n) !== 1n || (abs(p - q) >> (BigInt(opts.keysize) / 2n - 100n)) === 0n || p - q < isqrt(isqrt(2n * p * q)))
    // Makse sure e and lambda_n are coprime and lambda_n is prime
    //(bigInt.gcd(e, lambda).notEquals(1) || p.minus(q).abs().shiftRight(keysize / 2 - 100).isZero());

    let n = p * q
    assert(p - q > isqrt(isqrt(2n * n)), 'p − q is less than 2n^1/4 it\'s insecure')
    assert(lambda_n % e !== 0n, "Choosing a prime number for e leaves us only to check that e is not a divisor of lambda")

    let d = modmulinv(e, lambda_n) // (1n + (randomBInt() * lambda_n)) / e

    if (p > q && p < 2n * q)
    assert(d > isqrt(isqrt(n)) / 3n, 'if p is between q and 2q (which is quite typical) and d < (n^1/4)/3, then d can be computed efficiently from n and e')

    return {
        modulus: n,
        public_exp: e,
        private_exp: d
    }
}

/// End Region RSA-KeyGen

/// Begin Region RSA-Crypt

/**
 * Encrypts plain-padded-text with public key and modulus
 * @param {BigInt} PaddedText 
 * @param {BigInt} publickey 
 * @param {BigInt} modulus 
 */
export function EncryptM(PaddedText: bigint, publickey: bigint, modulus: bigint) {
    return powmod(PaddedText, publickey, modulus)
}

/**
 * Decrypts Ciphertext into plain-padded-text
 * @param {BigInt} CipherText 
 * @param {BigInt} privatekey 
 */
export function DecryptC(CipherText: bigint, privatekey: bigint, modulus: bigint) {
    return powmod(CipherText, privatekey, modulus)
}

export function Encrypt(text: string, publickey: bigint, modulus: bigint) {
    let padded = OAEP_Pad(text, (Number(bitLength(modulus)) + 7) >> 3)
    if (!padded) return null
    let ciphertext = EncryptM(padded, publickey, modulus)
    return ciphertext
}

export function Decrypt(ctext: bigint, privatekey: bigint, modulus: bigint) {
    let plain = DecryptC(ctext, privatekey, modulus)
    if (!plain) return null
    return OAEP_Unpad(plain, (Number(bitLength(modulus)) + 7) >> 3)
}

export function rawEncrypt(text: string, publickey: bigint, modulus: bigint) {
    return EncryptM(BuffertoBigIntBE(Buffer.from(text)), publickey, modulus);
}
export function rawDecrypt(ctext: bigint, privatekey: bigint, modulus: bigint) {
    return BigInttoBufferBE(DecryptC(ctext, privatekey, modulus)).toString();
}

/// End Region RSA-Crypt