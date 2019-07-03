export function Buff2bigint(buf: Buffer): bigint {
    const hex = Buffer.from(buf).toString('hex');
    if (hex.length === 0) {
        return BigInt(0);
    }
    return BigInt(`0x${hex}`);
}

export function bigint2Buff(num: bigint, width: number = -1): Buffer {
    const hex = num.toString(16);
    const buffer = Buffer.from(width < 0 ? hex : hex.padStart(width * 2, '0').slice(0, width * 2), 'hex');
    return buffer;
}