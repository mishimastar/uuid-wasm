import { WASI, WASIOptions } from 'wasi';

import { ExportedParse, UUIDGen, UUIDModule } from './uuid.js';
import { GenBytes, ParseBytes } from './wasm.js';

export type ExtendedWASIOptions = WASIOptions & {
    version: 'unstable' | 'preview1';
};

const opts: ExtendedWASIOptions = { version: 'preview1' };

export const InitUUID = async (options = opts): Promise<UUIDModule> => {
    const wasi = new WASI(options);
    const wasmGen = await WebAssembly.compile(GenBytes);
    const { pasteShiftChar, getMilliseconds } = (await (
        await WebAssembly.instantiate(ParseBytes)
    ).instance.exports) as ExportedParse;
    const instanceGen = await WebAssembly.instantiate(wasmGen, { wasi_snapshot_preview1: wasi.wasiImport });

    const unsafeTimeFromV1 = (uuid: string): Date => {
        pasteShiftChar(28, uuid.charCodeAt(0)!);
        pasteShiftChar(24, uuid.charCodeAt(1)!);
        pasteShiftChar(20, uuid.charCodeAt(2)!);
        pasteShiftChar(16, uuid.charCodeAt(3)!);
        pasteShiftChar(12, uuid.charCodeAt(4)!);
        pasteShiftChar(8, uuid.charCodeAt(5)!);
        pasteShiftChar(4, uuid.charCodeAt(6)!);
        pasteShiftChar(0, uuid.charCodeAt(7)!);
        pasteShiftChar(44, uuid.charCodeAt(9)!);
        pasteShiftChar(40, uuid.charCodeAt(10)!);
        pasteShiftChar(36, uuid.charCodeAt(11)!);
        pasteShiftChar(32, uuid.charCodeAt(12)!);
        pasteShiftChar(56, uuid.charCodeAt(15)!);
        pasteShiftChar(52, uuid.charCodeAt(16)!);
        pasteShiftChar(48, uuid.charCodeAt(17)!);
        return new Date(Number(getMilliseconds()));
    };

    const alphabet: number[] = [];
    for (let i = 48; i < 58; i++) alphabet[i] = i;
    for (let i = 65; i < 71; i++) alphabet[i] = i + 32;
    for (let i = 97; i < 103; i++) alphabet[i] = i;
    const timeFromV1 = (uuid: string): Date => {
        if (typeof uuid !== 'string' || uuid.length !== 36) TypeError('uuid is not UUID v1', { cause: { uuid } });
        if (uuid[14] !== '1') TypeError('uuid is not UUID v1', { cause: { uuid } });
        pasteShiftChar(28, alphabet[uuid.charCodeAt(0)]!);
        pasteShiftChar(24, alphabet[uuid.charCodeAt(1)]!);
        pasteShiftChar(20, alphabet[uuid.charCodeAt(2)]!);
        pasteShiftChar(16, alphabet[uuid.charCodeAt(3)]!);
        pasteShiftChar(12, alphabet[uuid.charCodeAt(4)]!);
        pasteShiftChar(8, alphabet[uuid.charCodeAt(5)]!);
        pasteShiftChar(4, alphabet[uuid.charCodeAt(6)]!);
        pasteShiftChar(0, alphabet[uuid.charCodeAt(7)]!);
        pasteShiftChar(44, alphabet[uuid.charCodeAt(9)]!);
        pasteShiftChar(40, alphabet[uuid.charCodeAt(10)]!);
        pasteShiftChar(36, alphabet[uuid.charCodeAt(11)]!);
        pasteShiftChar(32, alphabet[uuid.charCodeAt(12)]!);
        pasteShiftChar(56, alphabet[uuid.charCodeAt(15)]!);
        pasteShiftChar(52, alphabet[uuid.charCodeAt(16)]!);
        pasteShiftChar(48, alphabet[uuid.charCodeAt(17)]!);
        return new Date(Number(getMilliseconds()));
    };

    return { ...new UUIDGen(wasi, instanceGen), unsafeTimeFromV1, timeFromV1 };
};
