const math = require('../dist/math')

const msbi = (n) => {
  let r = 0n
  while (n >>= 1) r++
  return r
}

// Natural Log
const ln = (n) => {
  let max = BigInt(Number.MAX_SAFE_INTEGER)
  let maxlog = Math.log(Number.MAX_SAFE_INTEGER)
  let t = 0
  while (n > max) {
    t += maxlog
    n /= max
  }
  if (n != 0n) {
    t += Math.log(Number(n))
  }
  return t
}

const log = (n, base) => {
  return ln(n) / Math.log(base)
}

const chinese_remainer = (n, a) => {
  let sum = 0n
  let prod = n.reduce((p, c) => p * c)
  for (let i in n){
    p = prod / n[i]
    sum += a[i] * math.modmulinv(p, n[i]) * p
  }
  return sum % prod
}

const trialPrimeCheck = (n) => {
  if (n < 2n)
    return false
  if (n === 2n || n === 3n)
    return true
  if (n % 2n === 0n || n % 3n === 0n)
    return false
  
  let maxDivisor = math.isqrt(n) + 1n
  let d = 5n
  let i = 2n
  while (n <= maxDivisor) {
    if (n % d === 0n)
      return false
    d += i
    i = 6n - i
  }
  return true
}

const primeFactors = (n, limit=null) => {
  let num = []
  while (n % 2n === 0n){
    num.push(2n)
    n /= 2n
  }

  while (n % 3n === 0n) {
    num.push(3n)
    n /= 3n
  }

  let maxDivisor = math.isqrt(n) + 1n
  if (limit) maxDivisor = limit
  let d = 5n
  let i = 2n
  while (d <= maxDivisor) {
    while(n % d === 0n){
      num.push(d)
      n /= d
    }
    
    d += i
    i = 6n -i
  }

  if (n > 2)
    num.push(n)

  return num
}


module.exports = {
  ln,
  log,
  msbi,
  chinese_remainer,
  trialPrimeCheck,
  primeFactors
}