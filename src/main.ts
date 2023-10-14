import { WASI, WASIOptions } from 'wasi';
import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { ExportedParse, UUIDGen, UUIDModule } from './uuid.js';

export type ExtendedWASIOptions = WASIOptions & {
    version: 'unstable' | 'preview1';
};

const opts: ExtendedWASIOptions = { version: 'preview1' };

export const InitUUID = async (options = opts): Promise<UUIDModule> => {
    const wasi = new WASI(options);
    const wasmGen = await WebAssembly.compile(await readFile(resolve(__dirname, './gen.wasm')));
    const { pasteShiftChar, getMilliseconds } = (await (
        await WebAssembly.instantiate(await readFile(resolve(__dirname, './parse.wasm')))
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

    const timeFromV1 = (uuid: string): Date => {
        if (typeof uuid !== 'string' || uuid.length !== 36) TypeError('uuid is not UUID v1', { cause: { uuid } });
        if (uuid[14] !== '1') TypeError('uuid is not UUID v1', { cause: { uuid } });
        const u = uuid.toLowerCase();
        return unsafeTimeFromV1(u);
    };

    return { ...new UUIDGen(wasi, instanceGen), unsafeTimeFromV1, timeFromV1 };
};
