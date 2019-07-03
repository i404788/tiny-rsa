const pad = require('../dist/pad')
const encode = require('../dist/encode')
const math = require('../dist/math')

{
  const msg = encode.Buff2bigint(Buffer.from('ABC'))
  console.log(`input: ${msg.toString(16)}`)
  const padded = pad.OAEP_Pad(msg, 128n)  
  console.log(`padded:   ${padded.toString(16)}`)
  console.warn(`Bitlength ${math.bitLength(padded)}, expecting ~1024`)
  const unpadded = pad.OAEP_Unpad(padded, 128n)
  console.log(`unpadded: ${unpadded.toString('hex')}`)
}

console.log('')

{
  const msg = encode.Buff2bigint(Buffer.from('ABC'))
  console.log(`input: ${msg.toString(16)}`)
  const padded = pad.PKCS1_OAEP_Pad(msg, 128n)  
  console.log(`padded:   ${padded.toString(16)}`)
  console.warn(`Bitlength ${math.bitLength(padded)}, expecting ~1024`)
  const unpadded = pad.PKCS1_OAEP_Unpad(padded, 128n)
  console.log(`unpadded: ${unpadded.toString('hex')}`)
}