export function BuffertoBigIntBE(buf: Buffer): bigint {
    const hex = Buffer.from(buf).toString('hex');
    if (hex.length === 0) {
        return BigInt(0);
    }
    return BigInt(`0x${hex}`);
}

export function BigInttoBufferBE(num: bigint, width: number = -1): Buffer {
    const hex = num.toString(16);
    const buffer = Buffer.from(width < 0 ? hex : hex.padStart(width * 2, '0').slice(0, width * 2), 'hex');
    return buffer;
}

export function hexToBytes(hex: string): Buffer {
    let bytes = Buffer.alloc(hex.length/2)
    for (let c = 0; c < hex.length; c += 2)
        bytes[c] = parseInt(hex.substr(c, 2), 16)
    return bytes;
}