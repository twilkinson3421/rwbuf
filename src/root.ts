/**
 * A simple byte-buffer reader and writer. Uses `node:buffer`. Supports little- and big-endianness.
 * Supports signed & unsigned integers of 8, 16, and 32 bits, as well as floats of 32 and 64 bits.
 * @module
 *
 * @example
 * ```ts
 * import * as rwbuf from "@zerm/rwbuf";
 * import { f32, f64, i8, u16, u32, u8 } from "@zerm/rwbuf";
 *
 * const myWriter = new rwbuf.Writer();
 * myWriter.write(u8, 0xab);
 * myWriter.write(u16, 0xcafe);
 * myWriter.write(u32, 0xdeadbeef);
 * myWriter.write(i8, -57);
 * myWriter.write(f64, 3.141592653589793);
 *
 * const myReader = new rwbuf.Reader(myWriter.buffer);
 * console.log(myReader.read(u8).toString(16));
 * console.log(myReader.read(u16).toString(16));
 * console.log(myReader.read(u32).toString(16));
 * console.log(myReader.read(i8));
 * console.log(myReader.read(f64));
 * ```
 */

export * from "./main.ts";
export * from "./types.ts";
