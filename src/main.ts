import { Buffer } from "node:buffer";
import { Endianness, type NumType } from "./types.ts";

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

    /**
     * Reads a string of the given encoding and length. Supports UTF-8 and UTF-16 strings.
     *
     * @param glyphType The type of the glyphs in the string
     * @param length The length of the string. If `nullTerm` is true, this is the maximum length of the string
     * @param nullTerm Whether the string should be null-terminated. The maximum bytes will still be read.
     */
    readUnicodeString(glyphType: NumType, length: number, nullTerm = false): string {
        if (glyphType.byteSize > 2) throw new Error("Only UTF-8 and UTF-16 strings are supported");
        const bytes = this.readBytes(length);
        const str = bytes.toString(glyphType.byteSize > 1 ? "utf-16le" : "utf-8");
        return nullTerm ? str.replace(/\0+$/, "") : str;
    }

    /**
     * Reads a string of the given encoding and length determined by a preceeding number
     * of the given type. Supports UTF-8 and UTF-16 strings.
     *
     * @param glyphType The type of the glyphs in the string
     * @param lenType The type of the preceeding length. If `nullTerm` is true, this is the maximum length of the string
     * @param nullTerm Whether the string should be null-terminated. The maximum bytes will still be read
     *
     * @example
     * ```ts
     * const name = myReader.readUnicodeStringWithLen(u8, u16, true);
     * // Reads a UTF-8, null-terminated string of length determined by a u16 preceeding the string
     * ```
     */
    readUnicodeStringWithLen(glyphType: NumType, lenType: NumType, nullTerm = false): string {
        return this.readUnicodeString(glyphType, this.read(lenType), nullTerm);
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
