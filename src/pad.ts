import { createHash } from 'crypto';
import { Buff2bigint, bigint2Buff } from './encode';
import { byteLength, randBits, concat } from './math';

const HASH_SIZE = 32
const HASH_SIZEn = BigInt(HASH_SIZE)

export function OAEP_MaskGen(seed: Buffer, len: number) {
    let mask = Buffer.alloc(len + HASH_SIZE), i = 0
    while (i * HASH_SIZE < len) {
        mask.write(createHash('sha256').update(
            Buffer.concat([seed, new Uint8Array([
                    (i & 0xff000000) >> 24,
                    (i & 0x00ff0000) >> 16,
                    (i & 0x0000ff00) >> 8,
                    i & 0x000000ff])]
                )).digest('latin1'),
            i * HASH_SIZE, HASH_SIZE, 'latin1')
        i += 1;
    }
    return mask.slice(0, len)
}


/**
 * Pads message using the RSA-OAEP-SHA256 algorithm, following the PKCS1 standard
 * @param s 
 * @param n 
 */
export function PKCS1_OAEP_Pad(s: bigint, n:bigint) {
    let k0 = (HASH_SIZEn << 1n) - 2n
    let m = byteLength(s)
    if (m > n - k0) throw "Message too big for RSA, increase key size or shorten message"
    // r = urandom
    let r = randBits(HASH_SIZEn * 8n)
    // k1 = n - m - k0
    // X = lHash | PS | 01 | M 
    let X = (Buff2bigint(createHash('sha256').update('').digest()) << ((n - m - k0 - 3n) * 8n)) | 1n
    X = concat(X, s)
    // X = X ⊕ G(r)
    X ^= Buff2bigint(OAEP_MaskGen(bigint2Buff(r), Number(n) - HASH_SIZE -1))
    // Y = r ⊕ H(X)
    let Y = r ^ Buff2bigint(OAEP_MaskGen(bigint2Buff(X), HASH_SIZE))

    return concat(X, Y) // 0x00 || X || Y
}

export function PKCS1_OAEP_Unpad(s: bigint, n:bigint) {
    // if (n < (HASH_SIZEn << 2n) + 2n) throw new Error("Cipher too short")

    // if (I[0] !== 0x00) throw "Decryption failed, bad start byte"
    let I = bigint2Buff(s)
    let X = I.slice(0, Number(n) - HASH_SIZE - 1)
    let Y = Buff2bigint(I.slice(Number(n) - HASH_SIZE - 1))

    // r = Y ⊕ H(X)
    let r = Y ^ Buff2bigint(OAEP_MaskGen(X, HASH_SIZE))
    // m = X ⊕ G(r)
    let padded = bigint2Buff(Buff2bigint(X) ^ Buff2bigint(OAEP_MaskGen(bigint2Buff(r), Number(n) - HASH_SIZE -1)))
    let recoveredM = padded.slice(HASH_SIZE)

    let i = 0
    while ((recoveredM[i] & 255) === 0) i++
    if ((recoveredM[i] & 255) !== 1) throw new Error("Decryption failed")

    return recoveredM.slice(i+1)
}

/**
 * Pads message using the MFG OAEP function, following the original algorithm
 * @param s The message to be padded
 * @param n The size of the modulus in bytes
 */
export function OAEP_Pad(s: bigint, n: bigint){
    // k0 = 2*len(H|G) - 1
    // m > n - k0?
    let k0 = (HASH_SIZEn << 1n) - 1n
    let m = byteLength(s)
    if (m > n - k0) throw "Message too big for RSA, increase key size or shorten message"
    // r = urandom
    let r = randBits(k0 * 8n)
    // k1 = n - m - k0
    // X = m00...00
    let X = (s << ((n - m - k0) * 8n))
    // X = X ⊕ G(r)
    X ^= Buff2bigint(OAEP_MaskGen(bigint2Buff(r), Number(n - k0)))
    // Y = r ⊕ H(X)
    let Y = r ^ Buff2bigint(OAEP_MaskGen(bigint2Buff(X), Number(k0)))

    return concat(X, Y)
}

/**
 * Unpads message originally padded with OAEP_Pad
 * @param s The message to be unpadded
 * @param n The size of the modulus in bytes
 */
export function OAEP_Unpad(s: bigint, n: bigint) {
    let k0 = (HASH_SIZEn << 1n) - 1n
    let m = byteLength(s)

    if (m < k0 + 2n) throw new Error("Cipher too short")

    let I = bigint2Buff(s)
    let X = I.slice(0, Number(n - k0))
    let Y = Buff2bigint(I.slice(Number(n - k0)))

    // r = Y ⊕ H(X)
    let r = Y ^ Buff2bigint(OAEP_MaskGen(X, Number(k0)))
    // m = X ⊕ G(r)
    let padded = Buff2bigint(X) ^ Buff2bigint(OAEP_MaskGen(bigint2Buff(r), Number(n - k0)))

    if (byteLength(padded) !== n - k0) console.warn(`padded text is not the expected length`)
    while ((padded & 255n) === 0n) padded >>= 8n;
    // if ((padded & 255n) !== 1n) throw new Error("Decryption failed")
    return bigint2Buff(padded)
}