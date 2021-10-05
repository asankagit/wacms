import { WASI } from '@wasmer/wasi';
let nodeBindings = require("@wasmer/wasi/lib/bindings/node");
import { WasmFs } from '@wasmer/wasmfs';
import { lowerI64Imports } from "@wasmer/wasm-transformer";
const fs = require("fs");

nodeBindings = nodeBindings.default || nodeBindings;

const wasmFilePath = "sizer.wasm";

// Instantiate a new WASI Instance
const wasmFs = new WasmFs();
let wasi = new WASI({
  args: [wasmFilePath, "/sandbox"],
  env: {},
  bindings: {
    ...nodeBindings,
    fs: fs
  },
  preopens: {
    '/sandbox': '/home/asanka/Documents/learn/webAssemblyPalygroud/wacms'
  }
})

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Async function to run our Wasm module/instance
const startWasiTask =
  async pathToWasmFile => {
    // Fetch the Wasm module and transform its interface
    let wasmBytes        = new Uint8Array(fs.readFileSync(pathToWasmFile))
    let loweredWasmBytes = lowerI64Imports(wasmBytes)

    // Instantiate the WebAssembly file
    let wasmModule = await WebAssembly.compile(loweredWasmBytes);
    let instance = await WebAssembly.instantiate(wasmModule, {
      ...wasi.getImports(wasmModule)
    });

    // Start the WASI instance
    wasi.start(instance)

     // Output what's inside of /dev/stdout!
    const stdout = await wasmFs.getStdOut();
    console.log({ stdout });
    return stdout
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Everything starts here
// startWasiTask(wasmFilePath)
export default {
  run: () => startWasiTask(wasmFilePath)
}

// https://github.com/wasmerio/docs.wasmer.io/tree/master/integrations/js/wasi
