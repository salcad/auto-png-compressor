# Auto PNG Compressor 

This project provides a tool to automatically compress PNG files in a specified directory using `pngquant`. The tool watches the directory for new PNG files, compresses them, and renames the compressed files with a `_compr` suffix. After compression, the original files are deleted.

The need to support ES modules in this application primarily stems from the fact that `pngquant-bin` is an ES module. ES modules use a different syntax and have different behaviors compared to CommonJS modules, which is why ts-node and TypeScript need to be configured to handle ES modules correctly. 

ES Modules require either the file to have a .mjs extension or to set "type": "module" in package.json.

## Features

- Watches a specified directory for new PNG files.
- Compresses PNG files using `pngquant`.
- Renames compressed files with a `_compr` suffix.
- Logs file size before and after compression.
- Deletes original files after compression.

## Prerequisites

- node.js (v20 or higher)
- npm (v10.2.4)
- libimagequant

    #### via Homebrew for macOS, 
    libimagequant is typically bundled with pngquant
    ```bash
    brew install pngquant
    ```

    #### via apt-get for Debian distributions
    ```bash
    sudo apt-get install libimagequant-dev
    ```

## Installation

1. Clone the repository or download the source code.

    ```bash
    git clone https://github.com/salcad/auto-png-compressor.git
    cd auto-png-compressor
    ```

2. Install the required npm packages. 

    ```bash
    npm install
    ```

## Usage

1. Create a `.env` file in the root of the project and update the `WATCHED_DIR` and `COMPRESSION_LEVEL` variables to match your needs.

    ```bash
    WATCHED_DIR=/path/to/your/folder
    COMPRESSION_LEVEL=50-70
    ```

2. Run the script in development mode.

    ```bash
    npm run dev
    ```

3. To build and run the project in production mode:

    ```bash
    npm run build
    npm start
    ```

4. Run test
   ```bash
    npm test
    ```

## Dependencies

- [chokidar](https://www.npmjs.com/package/chokidar): A file watcher for Node.js.
- [pngquant-bin](https://www.npmjs.com/package/pngquant-bin): A pngquant binary for use in Node.js.

## Development Dependencies

- [ts-node](https://www.npmjs.com/package/ts-node): TypeScript execution environment for Node.js.
- [typescript](https://www.npmjs.com/package/typescript): TypeScript language and compiler.
- [jest](https://www.npmjs.com/package/jest): JavaScript testing framework.
- [ts-jest](https://www.npmjs.com/package/ts-jest): Jest transformer for TypeScript.
- [@types/node](https://www.npmjs.com/package/@types/node): TypeScript definitions for Node.js.
- [@types/jest](https://www.npmjs.com/package/@types/jest): TypeScript definitions for Jest.

## TypeScript Configuration

Ensure your `tsconfig.json` includes the following configuration to support ES modules and `ts-node`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "typeRoots": ["./node_modules/@types", "./types"],
    "resolveJsonModule": true,
    "experimentalDecorators": true
  },
  "ts-node": {
    "transpileOnly": true,
    "esm": true,
    "experimentalSpecifierResolution": "node"
  },
  "include": ["src/**/*", "types/**/*.d.ts"],
  "exclude": ["node_modules", "dist", "tests"]
}
```


