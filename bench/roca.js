const utils = require('./utils')
const math = require('../dist/math')

let primes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n, 101n,
  103n, 107n, 109n, 113n, 127n, 131n, 137n, 139n, 149n, 151n, 157n, 163n, 167n]

let prints = [6n, 30n, 126n, 1026n, 5658n, 107286n, 199410n, 8388606n, 536870910n, 2147483646n, 67109890n, 2199023255550n,
  8796093022206n, 140737488355326n, 5310023542746834n, 576460752303423486n, 1455791217086302986n,
  147573952589676412926n, 20052041432995567486n, 6041388139249378920330n, 207530445072488465666n,
  9671406556917033397649406n,
  618970019642690137449562110n,
  79228162521181866724264247298n,
  2535301200456458802993406410750n,
  1760368345969468176824550810518n,
  50079290986288516948354744811034n,
  473022961816146413042658758988474n,
  10384593717069655257060992658440190n,
  144390480366845522447407333004847678774n,
  2722258935367507707706996859454145691646n,
  174224571863520493293247799005065324265470n,
  696898287454081973172991196020261297061886n,
  713623846352979940529142984724747568191373310n,
  1800793591454480341970779146165214289059119882n,
  126304807362733370595828809000324029340048915994n,
  11692013098647223345629478661730264157247460343806n,
  187072209578355573530071658587684226515959365500926n]

let length_to_time_years = {
    512: 0.000220562038803,
    544: 0.00147111662211,
    576: 0.00673857391044,
    608: 0.0618100348655,
    640: 0.281991193891,
    672: 4.17998973277,
    704: 39.5102151646,
    736: 3473.56982013,
    768: 342674.912512,
    800: 89394704.8817,
    832: 8359663659.84,
    864: 44184838761000.0,
    896: -1,
    928: -1,
    960: -1,
    992: 0.0658249816453,
    1024: 0.266074841608,
    1056: 1.28258930217,
    1088: 7.38296771318,
    1120: 20.2173702373,
    1152: 58.9125352286,
    1184: 415.827799825,
    1216: 1536.17130832,
    1248: 5415.49876704,
    1280: 46281.7555548,
    1312: 208675.856834,
    1344: 1586124.1447,
    1376: 13481048.41,
    1408: 102251985.84,
    1440: 1520923586.93,
    1472: 30924687905.9,
    1504: 1933367534430.0,
    1536: 135663316837000.0,
    1568: 7582543380680000.0,
    1600: 5.1035570593e+17,
    1632: 3.8899705405e+19,
    1664: 3.66527648803e+21,
    1696: 3.77984169396e+23,
    1728: 5.14819714267e+25,
    1760: 6.24593092623e+27,
    1792: 8.73499845222e+29,
    1824: 1.87621309001e+32,
    1856: 2.9671795418e+34,
    1888: -1,
    1920: -1,
    1952: -1,
    1984: 28.6856385392,
    2016: 60.644701708,
    2048: 140.849490658,
    2080: 269.272545592,
    2112: 724.550220558,
    2144: 1262.66048991,
    2176: 3833.6903835,
    2208: 7049.61288162,
    2240: 14511.7355032,
    2272: 41968.716653,
    2304: 105863.580849,
    2336: 509819.310451,
    2368: 863135.14224,
    2400: 3730089.12073,
    2432: 14337269.1935,
    2464: 55914941.3902,
    2496: 144036102.003,
    2528: 972239354.935,
    2560: 1732510677.27,
    2592: 10345329708.8,
    2624: 72172778459.7,
    2656: 386464106155.0,
    2688: 1706310772440.0,
    2720: 14920435519400.0,
    2752: 77755063482200.0,
    2784: 1237655413740000.0,
    2816: 7524587305980000.0,
    2848: 4.66421299974e+16,
    2880: 5.41036780376e+17,
    2912: 6.07066413463e+18,
    2944: 6.17088797501e+19,
    2976: 4.35440413514e+20,
    3008: 1.04496910207e+22,
    3040: 2.91790333753e+23,
    3072: 2.84373206239e+25,
    3104: 1.21552661668e+27,
    3136: 1.14739892383e+29,
    3168: 7.03739127786e+30,
    3200: 5.5123347741e+32,
    3232: 5.46349546772e+34,
    3264: 3.07923071536e+36,
    3296: 4.88872482194e+37,
    3328: 4.74614877952e+39,
    3360: 5.94743522012e+41,
    3392: 3.63042884553e+43,
    3424: 3.15382165869e+45,
    3456: 4.22631927496e+47,
    3488: 4.57325850696e+50,
    3520: 7.58105156459e+52,
    3552: 8.44988925164e+54,
    3584: 2.1141023018e+57,
    3616: 2.95898599696e+59,
    3648: 7.23723533e+61,
    3680: 6.0951282339e+62,
    3712: 1.06824345519e+65,
    3744: 1.85662696289e+67,
    3776: 5.64628786015e+69,
    3808: 1.38273039654e+72,
    3840: -1,
    3872: -1,
    3904: -1,
    3936: -1,
    3968: 47950588.0004,
    4000: 134211454.052,
    4032: 201770331.337,
    4064: 613149724.539,
    4096: 1283252196.93,
}

const groupby = (array) => {
  let map = {}
  for (const it of array) {
    const n = Number(it)
    map[n] = map[n] || 0
    map[n] += 1
  }
  return map
}

const primorial = (max_prime=167n) => {
  let mprime = primes[primes.length-1]
  if (max_prime > mprime)
     throw `Current primorial implementation does not support values above ${mprime}`

  let primorial = 1n
  let phi_primorial = 1n
  for (prime of primes){
      primorial *= prime
      phi_primorial *= prime - 1n
  }
  return {m: primorial, phiM: phi_primorial}
}

const elementOrder = (element, modulus, phiM, phiMDecomposition) => {
  if (element === 1n)
    return 1n
  
  if (math.powmod(element, phiM, modulus) != 1)
    return null
  
  let order = phiM
  for (const factor in phiMDecomposition) {
    let power = phiMDecomposition[factor]
    for (let i = 1; i < power + 1; i++) {
      let nextOrder = order / BigInt(factor)
      if (math.powmod(element, nextOrder, modulus) === 1n)
        order = nextOrder
      else
        break
    }
  }
  return order
}

const discreteLog = (element, generator, generatorOrder, generatorOrderDecomposition, modulus) => {
  if (math.powmod(element, generatorOrder, modulus) != 1)
    return null

  let moduli = []
  let remainers = []
  for (const prime in generatorOrderDecomposition) {
    const power = generatorOrderDecomposition[prime]
    let primeToPower = BigInt(prime) ** BigInt(power)
    let orderDivPrimePower = generatorOrder / primeToPower
    let gDash = math.powmod(generator, orderDivPrimePower, modulus)
    let hDash = math.powmod(element, orderDivPrimePower, modulus)
    let found = false
    for (let i = 0n; i < primeToPower; i++) {
      if (math.powmod(gDash, i, modulus) === hDash){
        remainers.push(i)
        moduli.push(primeToPower)
        found = true
        break
      }
    }
    if (!found)
      return null
  }

  let ccrt = utils.chinese_remainer(moduli, remainers)
  return ccrt
}

const generator = 65537n
const maxPrime = 167n
const { m, phiM } = primorial(maxPrime)
const phiMDecomposition = groupby(utils.primeFactors(phiM, maxPrime))
const generatorOrder = elementOrder(generator, m, phiM, phiMDecomposition)
const generatorOrderDecomposition = groupby(utils.primeFactors(generatorOrder, maxPrime))

const hasFingerprintDlog = (mod) => {
  if (!isAcceptableModulus(mod)) return false
  return discreteLog(mod, generator, generatorOrder, generatorOrderDecomposition, m) !== null
}

const isAcceptableModulus = (mod) => mod >= 2n ** 256n
const hasFingerprintModulus = (mod) => {
  if (!isAcceptableModulus(mod)) return false
  for (i in primes){
      if (((1n << (mod % primes[i])) & prints[i]) === 0n)
          return false
  }
  return true
}

const calcEffort = (mod) => {
  let META_AMZ_FACT = 92 / 152  // conversion from university cluster to AWS
  let AMZ_C4_PRICE = 0.1  // price of 2 AWS CPUs per hour

  let length = Math.ceil(utils.log(mod, 2))
  let length_ceiling = Math.ceil(length / 32) * 32

  let effort_price
  let effort_time = length_to_time_years[length_ceiling]
  if (effort_time === undefined)
      effort_time = -1
  if (effort_time > 0){
      effort_time *= META_AMZ_FACT  // scaling to more powerful AWS CPU
      effort_price = effort_time * 365.25 * 24 * 0.5 * AMZ_C4_PRICE
  } else {
    effort_price = -1
  }

  let json_info = {
    effort_price,
    effort_time
  }
  return json_info
}

{
  const rsa = require('../dist/rsa')
  const useDLog = true // DLog is the new algo, moduli is the old algo
  
  for (let i = 0n; i < 3n; i++) {
    let keysize = (2n ** i) * 1024n
    let key = rsa.generateKey(keysize)
    let effort = calcEffort(key.modulus)
    console.log(`key (${keysize}): ${effort.effort_time} years, and ${effort.effort_price}$ to crack`)
    let hasFingerprint = useDLog ? hasFingerprintDlog(key.modulus) : hasFingerprintModulus(key.modulus) 
    if (hasFingerprint){
      console.log(`Key is **vulnerable** to ROCA: mod: ${key.modulus.toString(16)}; priv: ${key.private_exp.toString(16)}; public exponent: ${key.public_exp.toString(16)}`)    
    } else {
      console.log(`Key not vulnerable to ROCA`)
    }
  }
}