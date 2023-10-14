<h1 align="center">uuid-wasm</h1>
<p>
  <a href="https://www.npmjs.com/package/uuid-wasm" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/uuid-wasm.svg">
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D14.21.3-blue.svg" />
  <a href="https://github.com/mishimastar/uuid-wasm#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/mishimastar/uuid-wasm/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/mishimastar/uuid-wasm/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/mishimastar/uuid-wasm" />
  </a>
</p>

> A WebAssembly implementation of UUID v1 generator and parser
>
> Supports both ESM an CommonJS

### 🏠 [Homepage](https://github.com/mishimastar/uuid-wasm#readme)

## Prerequisites

-   node >=14.21.3

## Install

```sh
npm i uuid-wasm
```

## Usage

```ts
import { InitUUID } from 'uuid-wasm';

const run = async () => {
    const { v1, nanos, timeFromV1, unsafeTimeFromV1 } = await InitUUID();

    const uuid = v1();
    console.log(uuid);
    // 6335ff92-6a7a-11ee-929a-eedc63b9d38e

    const nanoseconds = nanos();
    console.log(nanoseconds);
    // 1697278437810573000n

    const date1 = timeFromV1(uuid);
    console.log(date1);
    // 2023-10-14T10:13:57.810Z
    console.log(date1.getTime());
    // 1697278547627

    const date2 = unsafeTimeFromV1(uuid);
    console.log(date2);
    // 2023-10-14T10:13:57.810Z
    console.log(date2.getTime());
    // 1697278547627
};

run().catch(console.error);
```

## Author

**Sergey Saltykov**

-   Github: [@mishimastar](https://github.com/mishimastar)
-   Email: <mishimastar3000@gmail.com>

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/mishimastar/uuid-wasm/issues).

## Show your support

Give a ⭐️ if this project helped you!

## License

Copyright © 2023 [Sergey Saltykov](https://github.com/mishimastar).<br />
This project is [MIT](https://github.com/mishimastar/uuid-wasm/blob/master/LICENSE) licensed.
