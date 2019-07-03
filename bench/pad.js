{
  const pad = require('../dist/pad')
  const encode = require('../dist/encode')
  const math = require('../dist/math')

  const msg = encode.Buff2bigint(Buffer.from('ABC'))
  console.log(`input: ${msg.toString(16)}`)
  const padded = pad.OAEPv1_Pad(msg, 128n)  
  console.log(`padded:   ${padded.toString(16)}`)
  if (math.bitLength(padded) !== 1024n) console.warn(`Bitlength not 1024n, but ${math.bitLength(padded)}`)
  const unpadded = pad.OAEPv1_Unpad(padded, 128n)
  console.log(`unpadded: ${unpadded.toString('hex')}`)
}