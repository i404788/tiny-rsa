import crypto from 'crypto';
import { hexToBytes } from "./encode";

const HASH_SIZE = 32 // sha256

function OAEP_MaskGen(seed: number[], len: number) {
    var mask = '', i = 0
    while (mask.length < len) {
        mask += crypto.createHash('sha256').update(String.fromCharCode.apply(String, seed.concat([
            (i & 0xff000000) >> 24,
            (i & 0x00ff0000) >> 16,
            (i & 0x0000ff00) >> 8,
            i & 0x000000ff]))).digest();
        i += 1;
    }
    return mask
}

/**
 * PKCS#1 (OAEP) pad input string s to n bytes, and return a bigint
 * @param {String} s Text used for message
 * @param {Number} n Amount of bytes to output
 */
export function OAEP_Pad(s: string, n: number) {
    if (s.length + 2 * HASH_SIZE + 2 >= n) throw "Message too long for RSA, increase key size or shorten message"
    let PS = ''
    for (let i = 0; i < n - s.length - 2 * HASH_SIZE - 2; i += 1) {
        PS += '\x00'
    }
    // DB = pHash || 00 ... || 01 || M
    var DB = crypto.createHash('sha256').update('').digest() + PS + '\x01' + s

    var seed = Array.from(crypto.randomBytes(HASH_SIZE))
    var dbMask = OAEP_MaskGen(seed, DB.length)
    var maskedDB = []
    for (let i = 0; i < DB.length; i += 1) {
        maskedDB[i] = DB.charCodeAt(i) ^ dbMask.charCodeAt(i)
    }
    var seedMask = OAEP_MaskGen(maskedDB, seed.length);
    var maskedSeed = [0]
    for (let i = 0; i < seed.length; i += 1) {
        maskedSeed[i + 1] = seed[i] ^ seedMask.charCodeAt(i)
    }
    return BigInt('0x' + Buffer.from(maskedSeed.concat(maskedDB)).toString('hex'))
}

/**
 * Undo PKCS#1 (OAEP) padding and, if valid, return the plaintext
 * @param {String} f Padded text used for message
 * @param {Number} n Amount of bytes to output
 */
export function OAEP_Unpad(f: bigint, n: number) {
    let d = hexToBytes(f.toString(16))
    for (let i = 0; i < d.length; i += 1) {
        d[i] &= 0xff
    }
    while (d.length < n) {
        d.unshift(0)
    }
    let s = String.fromCharCode.apply(String, d);
    if (s.length <= 2 * HASH_SIZE + 2) throw new Error("Cipher too short")

    var maskedSeed = Buffer.from(s.substr(1, HASH_SIZE));
    var maskedDB = Buffer.from(s.substr(HASH_SIZE + 1));
    var seedMask = Buffer.from(OAEP_MaskGen(Array.from(maskedDB), HASH_SIZE));
    var seed = [], i;
    for (i = 0; i < maskedSeed.length; i += 1) {
        seed[i] = maskedSeed[i] ^ seedMask[i]
    }
    var dbMask = Buffer.from(OAEP_MaskGen(seed, s.length - HASH_SIZE))
    let DB: number[] = [];
    for (i = 0; i < maskedDB.length; i += 1) {
        DB[i] = maskedDB[i] ^ dbMask[i];
    }
    let DB_str = String.fromCharCode.apply(String, DB)
    if (DB_str.substr(0, HASH_SIZE) !== crypto.createHash('sha256').update('').digest().toString()) throw new Error("Hash mismatch")

    DB_str = DB_str.substr(HASH_SIZE);
    var first_one = DB_str.indexOf('\x01')
    var last_zero = (first_one != -1) ? DB_str.substr(0, first_one).lastIndexOf('\x00') : -1
    if (last_zero + 1 !== first_one) throw new Error("Malformed data")

    return DB_str.substr(first_one + 1)
}