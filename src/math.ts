import {randomBytes} from 'crypto';

export function powmod(base: bigint, exp: bigint, m: bigint): bigint {
    if (exp === 0n) return 1n
    if ((exp & 1n) === 0n) return (powmod(base, exp / 2n, m) ** 2n) % m
    return (base * powmod(base, exp - 1n, m)) % m
}

export function isqrt(n: bigint): bigint {
    if (n < 2n) return n

    let smallD = isqrt(n >> 2n) << 1n;
    let largeD = smallD + 1n
    if (largeD * largeD > n)
        return smallD
    else
        return largeD
}

export function egcd(a: bigint, b: bigint): {gcd: bigint, bx: bigint, by: bigint} {
    if (!b) return {gcd: a, bx: 1n, by: 0n};
    const {gcd, bx, by} = egcd(b, a % b);
    return {gcd, bx: by, by: bx - (a / b) * by};
}
export const gcd = (a: bigint, b: bigint): bigint => egcd(a, b).gcd;
export const lcm = (a: bigint, b: bigint) => (a * b) / gcd(a, b)
export const abs = (n: bigint) => n < 0n ? n * -1n: n

export function modmulinv(n: bigint, mod: bigint){
    let {gcd, bx} = egcd(n, mod);
    if (gcd !== 1n) throw new Error("Inverse does not exist")
    return (bx % mod + mod) % mod;
}


export function byteLength (n: bigint) {
    return BigInt(Math.ceil(n.toString(16).length/2))
}

export function bitLength (n: bigint) {
    let i = 0n
    while (n >> i) {
        i++
    }
    return i
}

export const rand = (size_t: number) => BigInt(`0x${randomBytes(size_t).toString('hex')}`)
export const randBits = (bits: bigint) => rand(Math.ceil(Number(bits) / 8)) % (1n << bits)
export const randRange = (n: bigint, min = 0n) => {
    if (n <= min) throw new Error("n needs to be higher than min");
    let current = (randBits(bitLength(n)+1n) + min) % n;
    return current
}

export function fermatPrime(n: bigint, s: number) {
    if (n <= 1n) return false
    if (n <= 3n) return true
    for (let i = 0; i < s; i++) {
        let a = randRange(n - 1n, 2n);
        if (powmod(a, n - 1n, n) !== 1n)
            return false
    }            
    return true
}

export function randomPrime(bits: bigint) {
    const min = 6074001000n << (bits - 33n)  // min ≈ √2 × 2^(bits - 1)
    const max = (1n << bits) - 1n  // max = 2^(bits) - 1
    let current = randRange(max, min)
    if (!(current & 1n)) ++current
    while (true) {
        if (fermatPrime(current, 50)) {
            return current
        }
        current += 2n
        if (current > max) {
            current = randRange(max, min)
            if (!(current & 1n)) ++current
        }
    }
}