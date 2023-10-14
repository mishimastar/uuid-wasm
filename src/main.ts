import { WASI, WASIOptions } from 'wasi';
import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { UUIDMod, UUIDModule } from './uuid';

export type ExtendedWASIOptions = WASIOptions & {
    version: 'unstable' | 'preview1';
};

const opts: ExtendedWASIOptions = { version: 'preview1' };

export const InitUUID = async (options = opts): Promise<UUIDModule> => {
    const wasi = new WASI(options);
    const wasm = await WebAssembly.compile(await readFile(resolve(__dirname, './uuid.wasm')));
    const instance = await WebAssembly.instantiate(wasm, { wasi_snapshot_preview1: wasi.wasiImport });

    return new UUIDMod(wasi, instance);
};
