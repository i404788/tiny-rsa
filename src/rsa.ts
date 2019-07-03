import { OAEP_Pad, OAEP_Unpad, PKCS1_OAEP_Unpad, PKCS1_OAEP_Pad } from './pad';
import { randomPrime, isqrt, modmulinv, abs, lcm, gcd, powmod, fermatPrime, byteLength } from './math';
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

export function Encrypt(text: Buffer, key: {publickey: bigint, modulus: bigint, privatekey?: bigint}, padalgo: 'pkcs#1-oaep' | 'oaep' = 'oaep') {
    let intText = Buff2bigint(text)
    // Keep 1 byte headroom
    let padded
    switch (padalgo) {
        case 'oaep':
            padded = OAEP_Pad(intText, byteLength(key.modulus) - 1n)
            break;
        case 'pkcs#1-oaep':
            padded = PKCS1_OAEP_Pad(intText, byteLength(key.modulus) - 1n)
            break;
    }
    if (!padded) return null
    let ciphertext = powmod(padded, key.publickey, key.modulus)
    return ciphertext
}

export function Decrypt(ctext: bigint, key: {privatekey: bigint, modulus: bigint, publickey?: bigint}, padalgo: 'pkcs#1-oaep' | 'oaep' = 'oaep') {
    let plain = powmod(ctext, key.privatekey, key.modulus)
    if (!plain) return null
    switch (padalgo) {
        case 'oaep':
            return OAEP_Unpad(plain, byteLength(key.modulus) - 1n)       
        case 'pkcs#1-oaep':
            return PKCS1_OAEP_Unpad(plain, byteLength(key.modulus) - 1n)
    }
}

export function rawEncrypt(text: Buffer, publickey: bigint, modulus: bigint) {
    return powmod(Buff2bigint(text), publickey, modulus);
}
export function rawDecrypt(ctext: bigint, privatekey: bigint, modulus: bigint) {
    return bigint2Buff(powmod(ctext, privatekey, modulus)).toString();
}

/// End Region RSA-Crypt