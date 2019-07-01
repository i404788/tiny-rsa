import {randomBytes} from 'crypto';
import assert from 'assert';

export function powmod(base: bigint, exp: bigint, m: bigint): bigint {
    if (exp === 0n) return 1n
    if ((exp & 1n) === 0n) return (powmod(base, exp / 2n, m) ** 2n) % m
    return (base * powmod(base, exp - 1n, m)) % m
}

export function isqrt(n: bigint): bigint {
    assert.ok(n >= 0, `integerSqrt works for only nonnegative inputs (${n})`)
    if(n < 2) return n

    let smallD = isqrt(n >> 2n) << 1n;
    let largeD = smallD + 1n
    if (largeD * largeD > n)
        return smallD
    else
        return largeD
}

// function isqrt(n: bigint): bigint {
//     if (n <= 0n) return 0n
//     let x = 0n
//     let y = n
//     while (true) {
//         x = y
//         y = (y + n / y) / 2n
//         if (x <= y) return x
//     }
// }

// export function totient(p: bigint, q: bigint): bigint {
//     return (p - 1n) * (q - 1n)
// }

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
    assert.equal(gcd, 1n, "Inverse does not exist");
    return (bx % mod + mod) % mod;
}

// Mod needs to be prime
// export function modmulinv(n: bigint, mod: bigint): bigint {
//     // assert.ok()
//     return powmod(n, mod - 2n, mod)
// }

// a & m need to be coprime
// function modmulinv(a: bigint, m: bigint) {
//     a = (a % m + m) % m
//     if (!a || m < 2n) {
//         return NaN // invalid input
//     }
//     // find the gcd
//     const s = []
//     let b = m
//     while (b) {
//         [a, b] = [b, a % b]
//         s.push({ a, b })
//     }
//     if (a !== 1n) {
//         return NaN // inverse does not exists
//     }
//     // find the inverse
//     let x = 1n
//     let y = 0n
//     for (let i = s.length - 2; i >= 0; --i) {
//         [x, y] = [y, x - y * BigInt(s[i].a / s[i].b)]
//     }
//     return (y % m + m) % m
// }

// function byteLength (n: bigint) {
//     return Math.ceil(n.toString(16).length/2)
// }

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
    assert.ok(n > min, "n needs to be higher than min");
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

// function isStrongPseudoprime(n: bigint, a: bigint) {
//     let d = n - 1n;
//     let s = 0n
//     while (d % 2n == 0n) {
//         d = d / 2n
//         s = s + 1n
//     }
//     let t = powmod(a, d, n)
//     if (t == 1n) return true
//     while (s > 0n) {
//         if (t == n - 1n)
//         return true
//         t = (t * t) % n
//         s = s - 1n
//     }
//     return false
// }

// // by setting the value of k you can determine the likelihood of error as 1 chance in 4^k
// export function isPrime(n: bigint, k: number): boolean {
//     for (let i = 1; i < k; i++) {
//         let a = randomBInt(n - 1n, 2n) // TODO: bigint impl
//         if (isStrongPseudoprime(n, a) == false) // Composite
//             return false
//     }
//     return true //ProbablyPrime
// }

export function randomPrime(bits: number) {
    // const min = 6074001000n << (BigInt(bits) - 33n)  // min ≈ √2 × 2^(bits - 1)
    // const max = (1n << BigInt(bits)) - 1n  // max = 2^(bits) - 1
    let current = randBits(BigInt(bits))
    if (!(current & 1n)) ++current
    while (true) {
        if (fermatPrime(current, 50)) {
            return current
        }
        current += 2n
    }
}