'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const fs_1 = require('fs');
const node_path_1 = require('node:path');
const genBytes = JSON.stringify(Array.from((0, fs_1.readFileSync)((0, node_path_1.resolve)(__dirname, './src/gen.wasm'))));
const parseBytes = JSON.stringify(
    Array.from((0, fs_1.readFileSync)((0, node_path_1.resolve)(__dirname, './src/parse.wasm')))
);
(0, fs_1.writeFileSync)(
    (0, node_path_1.resolve)(__dirname, './src/wasm.ts'),
    `export const GenBytes = new Uint8Array(${genBytes});\n export const ParseBytes = new Uint8Array(${parseBytes});\n`
);
