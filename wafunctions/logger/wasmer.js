import { WASI } from '@wasmer/wasi';
let nodeBindings = require("@wasmer/wasi/lib/bindings/node");
import { WasmFs } from '@wasmer/wasmfs';
import { lowerI64Imports } from "@wasmer/wasm-transformer";
const fs = require("fs");
import fetch from "node-fetch"
import { performance } from 'perf_hooks'
import path from 'path'

nodeBindings = nodeBindings.default || nodeBindings;

const wasmFilePath = path.join(__dirname, "../target/wasm32-wasi/debug/Logger.wasm");
// global.fetch = fetch
// console.log({ performance })
// Instantiate a new WASI Instance
const wasmFs = new WasmFs();
let wasi = new WASI({
  args: [wasmFilePath, "/sandbox"],
  env: {
    performance,
    fetch
  },
  bindings: {
    ...nodeBindings,
    fs: fs,
    fetch: fetch,
    performance: performance
  },
  preopens: {
    '/sandbox': '/home/asanka/Documents/learn/webAssemblyPalygroud/wacms/wafunctions'
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
    console.log(stdout);
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Everything starts here
// console.log("fetc", fetch)
// startWasiTask(wasmFilePath)
export default {
  run: () => startWasiTask(wasmFilePath)
}

// https://github.com/wasmerio/docs.wasmer.io/tree/master/integrations/js/wasi

