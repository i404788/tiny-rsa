const benchmark = require('benchmark')
const math = require('../dist/math')
let suite = new benchmark.Suite

function rarr(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

let primes = []
for (let i = 0; i < 100; i++) {
    primes.push(math.randomPrime(256))
}

let notPrimes = []
for (let i = 0; i < 1000; i++) {
    let x = math.randBits(256n)
    if (math.fermatPrime(x, 50)) {
        i--
        continue
    }
    notPrimes.push(x)
}

function isqrt_a(n) {
    if (n <= 0n) return 0n
    let x = 0n
    let y = n
    while (true) {
        x = y
        y = (y + n / y) / 2n
        if (x <= y) return x
    }
}

console.log("Running ISqrt Benchmark")
suite.add('ISqrt#current', function () {
        math.isqrt(rarr(primes))
    })
    .add('ISqrt#B', function () {
        isqrt_a(rarr(primes))
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
        console.log('Ran: ' + JSON.stringify(this.filter('successful').map('name')))
    })
    .run();


////--------------------------------------------////

suite = new benchmark.Suite
console.log("Running ModMulInv Benchmark")

// Mod needs to be prime
function modmulinv_b(n, mod) {
//     // assert.ok()
    return math.powmod(n, mod - 2n, mod)
}

// a & m need to be coprime
function modmulinv_c(a, m) {
    a = (a % m + m) % m
    if (!a || m < 2n) {
        return NaN // invalid input
    }
    // find the gcd
    const s = []
    let b = m
    while (b) {
        [a, b] = [b, a % b]
        s.push({ a, b })
    }
    if (a !== 1n) {
        return NaN // inverse does not exists
    }
    // find the inverse
    let x = 1n
    let y = 0n
    for (let i = s.length - 2; i >= 0; --i) {
        [x, y] = [y, x - y * BigInt(s[i].a / s[i].b)]
    }
    return (y % m + m) % m
}

suite.add('ModMulInv#current', function () {
    try {
        math.modmulinv(rarr(primes), rarr(primes))
    } catch{}
})
.add('ModMulInv#B', function () {
    modmulinv_b(rarr(primes), rarr(primes))
})
.add('ModMulInv#C', function () {
    modmulinv_c(rarr(primes), rarr(primes))
})
.on('cycle', function (event) {
    console.log(String(event.target));
})
.on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
    console.log('Ran: ' + JSON.stringify(this.filter('successful').map('name')))
})
.run();

////--------------------------------------------////

suite = new benchmark.Suite
console.log("Running PrimeCheck Benchmark")

function isStrongPseudoprime(n, a) {
    let d = n - 1n;
    let s = 0n
    while (d % 2n == 0n) {
        d = d / 2n
        s = s + 1n
    }
    let t = math.powmod(a, d, n)
    if (t == 1n) return true
    while (s > 0n) {
        if (t == n - 1n)
        return true
        t = (t * t) % n
        s = s - 1n
    }
    return false
}

// by setting the value of k you can determine the likelihood of error as 1 chance in 4^k
function isPrime(n, k) {
    for (let i = 1; i < k; i++) {
        let a = math.randRange(n - 1n, 2n)
        if (isStrongPseudoprime(n, a) == false) // Composite
            return false
    }
    return true //ProbablyPrime
}

function MillerRabin(n, k) {
    if (n == 2n || n == 3n) return true
    if (n <= 1n || n % 2n == 0n) return false
    // # find r and s
    let s = 0n
    let r = n - 1n
    while ((r & 1n) == 0n){
        s += 1n
        r /= 2n
    }
    // # do k tests
    for (let i = 0; i < k; i++) {
        let a = math.randRange(n - 1n, 2n)
        let x = math.powmod(a, r, n)
        if (x != 1n && x != (n - 1n)){
            let j = 1n
            while (j < s && x != (n - 1n)){
                x = math.powmod(x, 2n, n)
                if (x == 1n) return false
                j += 1n
            }
            if (x != (n - 1n)) return false   
        }
    }
    return true
}



let accuracy = [{'total': 0, 'false_neg': 0, 'false_pos': 0}, {'total': 0, 'false_neg': 0, 'false_pos': 0},{'total': 0, 'false_neg': 0, 'false_pos': 0}]
const params = [1, 2, 1];

suite.add('PrimeCheck#current', function () {
    accuracy[0]['total']++
    if (!math.fermatPrime(rarr(primes), params[0])) accuracy[0]['false_neg']++
    if (math.fermatPrime(rarr(notPrimes), params[0])) accuracy[0]['false_pos']++
})
.add('PrimeCheck#B', function () {
    accuracy[1]['total']++
    if (!isPrime(rarr(primes), params[1])) accuracy[1]['false_neg']++
    if (isPrime(rarr(notPrimes), params[1])) accuracy[1]['false_pos']++
})
.add('PrimeCheck#MillerRabin', function () {
    accuracy[2]['total']++
    try{
    if (!MillerRabin(rarr(primes), params[2])) accuracy[2]['false_neg']++
    if (MillerRabin(rarr(notPrimes), params[2])) accuracy[2]['false_pos']++
    } catch(e) { console.log(e) }
})
.on('cycle', function (event) {
    console.log(String(event.target));
})
.on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
    console.log(`False negative rate: ${accuracy.map(x => x.false_neg / x.total)}`)
    console.log(`False positive rate: ${accuracy.map(x => x.false_pos / x.total)}`)
    console.log('Ran: ' + JSON.stringify(this.filter('successful').map('name')))
})
.run();

///------------------------------------///

suite = new benchmark.Suite

console.log("Running PrimeGen Benchmark")

function randomPrime(bits) {
    // const min = 6074001000n << (BigInt(bits) - 33n)  // min ≈ √2 × 2^(bits - 1)
    // const max = (1n << BigInt(bits)) - 1n  // max = 2^(bits) - 1
    let current = math.randBits(BigInt(bits))
    if (!(current & 1n)) ++current
    while (true) {
        if (math.fermatPrime(current, 50)) {
            return current
        }
        current += 2n
    }
}

accuracy = [{'total': 0, 'false_neg': 0, 'false_pos': 0}, {'total': 0, 'false_neg': 0, 'false_pos': 0}]

suite.add('PrimeGen#current', function () {
    accuracy[0]['total']++
    let x = math.randomPrime(1024)
    let prime = math.fermatPrime(x, 100)
    if (!prime) accuracy[0]['false_pos']++
})
.add('PrimeGen#B', function () {
    accuracy[1]['total']++
    let x = randomPrime(1024);
    let prime = math.fermatPrime(x, 100)
    if (!prime) accuracy[1]['false_pos']++
})
.on('cycle', function (event) {
    console.log(String(event.target));
})
.on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
    console.log(`False positive rate: ${accuracy.map(x => x.false_pos / x.total)}`)
    console.log('Ran: ' + JSON.stringify(this.filter('successful').map('name')))
})
.run({async: true});

