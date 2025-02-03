import { Buffer } from "node:buffer";
import { type NumType, Endianness } from "./types.ts";

/** A reader for a byte buffer */
export class Reader {
    /** The current position in the buffer */
    position = 0;
    /** The endianness of the source buffer */
    sourceEndianness: Endianness = Endianness.Little;

    constructor(public buffer: Buffer) {}

    /** Skips a number of bytes */
    skipBytes(length: number): this {
        if (this.position + length > this.buffer.length) throw new Error("End of stream");
        this.position += length;
        return this;
    }

    /** Reads a number of bytes */
    readBytes(length: number): Buffer {
        if (this.position + length > this.buffer.length) throw new Error("End of stream");
        const buf = this.buffer.subarray(this.position, this.position + length);
        this.position += length;
        return buf;
    }

    /** Reads a number of a given type */
    read(type: NumType): number {
        const value = type.readFn(this.buffer, this.position, this.sourceEndianness);
        this.position += type.byteSize;
        return value;
    }

    /**
     * Reads a number of bytes determined by a number of a given type
     *
     * @example
     * ```ts
     * const name = myReader.readBytesWithLen(u16);
     * // Reads a slice from the buffer; its length is determined by a u16 at the current position
     * ```
     */
    readBytesWithLen(lenType: NumType): Buffer {
        const len = this.read(lenType);
        return this.readBytes(len);
    }
}

/** A writer for a byte buffer */
export class Writer {
    /** The buffer to write to */
    buffer: Buffer = Buffer.alloc(0);
    /** The endianness of the destination buffer */
    destinationEndianness: Endianness = Endianness.Little;

    /** Writes a number of bytes */
    writeBytes(bytes: Buffer): this {
        this.buffer = Buffer.concat([this.buffer, bytes]);
        return this;
    }

    /** Writes a number of a given type */
    write(type: NumType, value: number): this {
        const buf = Buffer.alloc(type.byteSize);
        type.writeFn(buf, value, 0, this.destinationEndianness);
        this.buffer = Buffer.concat([this.buffer, buf]);
        return this;
    }

    /**
     * Writes a number of bytes, preceeded by its length in the given type
     *
     * @example
     * ```ts
     * myWriter.writeBytesWithLen(u16, Buffer.from("Hello, world!"));
     * // Writes a slice to the buffer, preceeded by its length as a u16
     * ```
     */
    writeBytesWithLen(lenType: NumType, bytes: Buffer): this {
        this.write(lenType, bytes.length);
        return this.writeBytes(bytes);
    }
}
