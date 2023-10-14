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

type Exported = {
    memory: WebAssembly.Memory;
    nanos: () => BigInt;
    gen: () => number;
    pasteShiftChar: (shift: number, charcode: number) => void;
    getMilliseconds: () => BigInt;
    /** UNSAFE!! ONLY 0-9 a-f*/
    parse16char: (charcode: BigInt) => BigInt;
};

export class UUIDMod implements UUIDModule {
    #memory: WebAssembly.Memory;
    #buffer: Buffer;
    #gen: () => number;
    #nanos: () => BigInt;
    #pasteShiftChar: (shift: number, charcode: number) => void;
    #getMilliseconds: () => BigInt;

    #uuidRegex = /^[0-9a-f]{8}\b-[0-9a-f]{4}\b-1[0-9a-f]{3}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/;

    constructor(wasi: WASI, instance: WebAssembly.Instance) {
        wasi.initialize(instance); // getting some random bytes via wasi
        const exp = instance.exports as Exported;
        this.#gen = exp.gen;
        this.#nanos = exp.nanos;
        this.#memory = exp.memory;
        this.#pasteShiftChar = exp.pasteShiftChar;
        this.#getMilliseconds = exp.getMilliseconds;
        this.#buffer = Buffer.from(this.#memory.buffer, 0, 512);
    }

    nanos = () => this.#nanos();

    v1 = (): string => {
        const ptr = this.#gen();
        return this.#buffer.toString('utf-8', ptr, ptr + 36);
    };

    timeFromV1 = (uuid: string): Date => {
        const u = uuid.toLowerCase();
        if (!this.#uuidRegex.test(u)) throw new TypeError('uuid is not UUID v1', { cause: { uuid: u } });
        return this.unsafeTimeFromV1(uuid);
    };

    unsafeTimeFromV1 = (uuid: string): Date => {
        this.#pasteShiftChar(28, uuid.charCodeAt(0)!);
        this.#pasteShiftChar(24, uuid.charCodeAt(1)!);
        this.#pasteShiftChar(20, uuid.charCodeAt(2)!);
        this.#pasteShiftChar(16, uuid.charCodeAt(3)!);
        this.#pasteShiftChar(12, uuid.charCodeAt(4)!);
        this.#pasteShiftChar(8, uuid.charCodeAt(5)!);
        this.#pasteShiftChar(4, uuid.charCodeAt(6)!);
        this.#pasteShiftChar(0, uuid.charCodeAt(7)!);
        this.#pasteShiftChar(44, uuid.charCodeAt(9)!);
        this.#pasteShiftChar(40, uuid.charCodeAt(10)!);
        this.#pasteShiftChar(36, uuid.charCodeAt(11)!);
        this.#pasteShiftChar(32, uuid.charCodeAt(12)!);
        this.#pasteShiftChar(56, uuid.charCodeAt(15)!);
        this.#pasteShiftChar(52, uuid.charCodeAt(16)!);
        this.#pasteShiftChar(48, uuid.charCodeAt(17)!);
        return new Date(Number(this.#getMilliseconds()));
    };
}
