{
  const pad = require('../dist/pad')

  const padded = pad.OAEP_Pad('ABC', 128)
  console.log(`padded:   ${padded.toString(16)}`)
  const unpadded = pad.OAEP_Unpad(padded, 128)
  console.log(`unpadded: ${unpadded}`)
}