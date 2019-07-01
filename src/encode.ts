/**
 * Convert a little-endian buffer into a BigInt.
 * @param buf The little-endian buffer to convert
 * @returns A BigInt with the little-endian representation of buf.
 */
export function BuffertoBigIntBE(buf: Buffer): bigint {
    const hex = Buffer.from(buf).toString('hex');
    if (hex.length === 0) {
        return BigInt(0);
    }
    return BigInt(`0x${hex}`);
}

/**
 * Convert a BigInt to a little-endian buffer.
 * @param num   The BigInt to convert.
 * @param width The number of bytes that the resulting buffer should be.
 * @returns A little-endian buffer representation of num.
 */
export function BigInttoBufferBE(num: bigint, width: number = -1): Buffer {
    const hex = num.toString(16);
    const buffer = Buffer.from(width < 0 ? hex : hex.padStart(width * 2, '0').slice(0, width * 2), 'hex');
    return buffer;
}

export function hexToBytes(hex: string) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}