import type { WASI } from 'wasi';

export interface UUIDModule {
    /**
     *  Generates UUID v1
     * @returns string
     */
    v1: () => string;
    /**
     *  Returns current timestamp in nanoseconds resolution
     * @returns BigInt
     */
    nanos: () => BigInt;
    /**
     *  Extracts timestamp from UUID v1
     * @param uuid - uuid v1
     * @returns Date
     */
    timeFromV1: (uuid: string) => Date;
    /**
     *  Unsafe version!! No check for valid uuid! Only /[0-9a-f-]/ symbols allowed!
     *  Extracts timestamp from UUID v1
     * @param uuid - uuid v1
     * @returns Date
     */
    unsafeTimeFromV1: (uuid: string) => Date;
}

type ExportedGen = {
    memory: WebAssembly.Memory;
    nanos: () => BigInt;
    gen: () => number;
    pasteShiftChar: (shift: number, charcode: number) => void;
    getMilliseconds: () => BigInt;
    /** UNSAFE!! ONLY 0-9 a-f*/
    parse16char: (charcode: BigInt) => BigInt;
};

export type ExportedParse = {
    pasteShiftChar: (shift: number, charcode: number) => void;
    getMilliseconds: () => BigInt;
    /** UNSAFE!! ONLY 0-9 a-f*/
    parse16char: (charcode: BigInt) => BigInt;
};

// const uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-1[0-9a-f]{3}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/;

export class UUIDGen {
    #memory: WebAssembly.Memory;
    #buffer: Buffer;
    #gen: () => number;
    #nanos: () => BigInt;

    constructor(wasi: WASI, instance: WebAssembly.Instance) {
        wasi.initialize(instance); // getting some random bytes via wasi
        const exp = instance.exports as ExportedGen;
        this.#gen = exp.gen;
        this.#nanos = exp.nanos;
        this.#memory = exp.memory;
        this.#buffer = Buffer.from(this.#memory.buffer, 0, 512);
    }

    nanos = () => this.#nanos();

    v1 = (): string => {
        const ptr = this.#gen();
        return this.#buffer.toString('utf-8', ptr, ptr + 36);
    };
}
