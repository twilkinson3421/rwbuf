import type { Buffer } from "node:buffer";

/** A type that can be read from, or written to, a buffer */
export class NumType {
    constructor(
        /** The number of bytes this type uses */
        public byteSize: number,
        /** Reads a number of this type from a buffer */
        public readFn: (buffer: Buffer, offset: number, endianness: Endianness) => number,
        /** Writes a number of this type to a buffer */
        public writeFn: (
            buffer: Buffer,
            value: number,
            offset: number,
            endianness: Endianness
        ) => void
    ) {}

    /** An unsigned 8-bit integer */
    static u8: NumType = new NumType(
        1,
        (b, o, _) => b.readUint8(o),
        (b, v, o, _) => b.writeUint8(v, o)
    );
    /** An unsigned 16-bit integer */
    static u16: NumType = new NumType(
        2,
        (b, o, e) => (e ? b.readUint16LE(o) : b.readUint16BE(o)),
        (b, v, o, e) => (e ? b.writeUint16LE(v, o) : b.writeUint16BE(v, o))
    );
    /** An unsigned 32-bit integer */
    static u32: NumType = new NumType(
        4,
        (b, o, e) => (e ? b.readUint32LE(o) : b.readUint32BE(o)),
        (b, v, o, e) => (e ? b.writeUint32LE(v, o) : b.writeUint32BE(v, o))
    );

    /** A signed 8-bit integer */
    static i8: NumType = new NumType(
        1,
        (b, o, _) => b.readInt8(o),
        (b, v, o, _) => b.writeInt8(v, o)
    );
    /** A signed 16-bit integer */
    static i16: NumType = new NumType(
        2,
        (b, o, e) => (e ? b.readInt16LE(o) : b.readInt16BE(o)),
        (b, v, o, e) => (e ? b.writeInt16LE(v, o) : b.writeInt16BE(v, o))
    );
    /** A signed 32-bit integer */
    static i32: NumType = new NumType(
        4,
        (b, o, e) => (e ? b.readInt32LE(o) : b.readInt32BE(o)),
        (b, v, o, e) => (e ? b.writeInt32LE(v, o) : b.writeInt32BE(v, o))
    );

    /** A 32-bit float */
    static f32: NumType = new NumType(
        4,
        (b, o, e) => (e ? b.readFloatLE(o) : b.readFloatBE(o)),
        (b, v, o, e) => (e ? b.writeFloatLE(v, o) : b.writeFloatBE(v, o))
    );
    /** A 64-bit float */
    static f64: NumType = new NumType(
        8,
        (b, o, e) => (e ? b.readDoubleLE(o) : b.readDoubleBE(o)),
        (b, v, o, e) => (e ? b.writeDoubleLE(v, o) : b.writeDoubleBE(v, o))
    );
}

/** Describes the endianness of a number. @see {@link https://en.wikipedia.org/wiki/Endianness} */
export enum Endianness {
    /** Big-endian */
    Big = 0,
    /** Little-endian */
    Little = 1,
}

/** An unsigned 8-bit integer */
export const u8 = NumType.u8;
/** An unsigned 16-bit integer */
export const u16 = NumType.u16;
/** An unsigned 32-bit integer */
export const u32 = NumType.u32;

/** A signed 8-bit integer */
export const i8 = NumType.i8;
/** A signed 16-bit integer */
export const i16 = NumType.i16;
/** A signed 32-bit integer */
export const i32 = NumType.i32;

/** A 32-bit float */
export const f32 = NumType.f32;
/** A 64-bit float */
export const f64 = NumType.f64;
