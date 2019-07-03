import { OAEP_Pad, OAEP_Unpad } from "./pad";
import { randomPrime, isqrt, modmulinv, abs, lcm, gcd, powmod, fermatPrime, byteLength } from "./math";
import { Buff2bigint, bigint2Buff } from './encode';

/// Begin Region KeyGen

export function generateKey(keysize = 2048n, e = 65537n, lambdaNf: 'carmichael' | 'euler' = 'carmichael') {
    if (e !== 65537n && !fermatPrime(e, 10)) throw new Error("'e' used in options is not prime")

    while (true) {
        let p = randomPrime(keysize / 2n)
        let q = randomPrime(keysize / 2n)
        let lambda_n = lambdaNf === 'euler' ? (p - 1n) * (q - 1n) : lcm(p - 1n, q - 1n)

        // Makse sure e and lambda_n are coprime
        if (gcd(e, lambda_n) !== 1n)
            continue

        let n = p * q
        // p − q is less than 2n^1/4 it's insecure
        if (abs(p - q) < isqrt(isqrt(2n * n)))
            continue

        // differ in length by a few digits to make factoring harder
        if (abs(p - q) >> (keysize / 2n - 100n) === 0n)
            continue

        let d = modmulinv(e, lambda_n)

        // if p is between q and 2q (which is quite typical) and d < (n^1/4)/3, then d can be computed efficiently from n and e
        if (p > q && p < 2n * q)
            if (d > isqrt(isqrt(n)) / 3n)
                continue
        
        
        return {
            modulus: n,
            public_exp: e,
            private_exp: d
        }
    }
}

/// End Region RSA-KeyGen

/// Begin Region RSA-Crypt

export function Encrypt(text: Buffer, publickey: bigint, modulus: bigint) {
    let intText = Buff2bigint(text)
    // Keep 1 byte headroom
    let padded = OAEP_Pad(intText, byteLength(modulus) - 1n)
    if (!padded) return null
    let ciphertext = powmod(padded, publickey, modulus)
    return ciphertext
}

export function Decrypt(ctext: bigint, privatekey: bigint, modulus: bigint) {
    let plain = powmod(ctext, privatekey, modulus)
    if (!plain) return null
    return OAEP_Unpad(plain, byteLength(modulus) - 1n)
}

export function rawEncrypt(text: Buffer, publickey: bigint, modulus: bigint) {
    return powmod(Buff2bigint(text), publickey, modulus);
}
export function rawDecrypt(ctext: bigint, privatekey: bigint, modulus: bigint) {
    return bigint2Buff(powmod(ctext, privatekey, modulus)).toString();
}

/// End Region RSA-Crypt