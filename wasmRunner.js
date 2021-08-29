const fs = require('fs');
var source = fs.readFileSync('/home/asanka/Documents/learn/emscripten_test_folder/main.wasm');
/////////////////////////////////////////////////////////////
const WASIwrapper = require('wasi')
const { WASI } = WASIwrapper
const wasi = new WASI({
  args: process.argv,
  env: process.env,
  preopens: {
    '/sandbox': "/",
  }
});
/////////////////////////////////////////////////////////

let buff =  Buffer.from(source)
var typedArray = new Uint8Array(source).buffer;

const env = {
    memoryBase: 0,
    tableBase: 0,
    memory: new WebAssembly.Memory({
      initial: 256
    }),
    table: new WebAssembly.Table({
      initial: 0,
      element: 'anyfunc'
    }),
    imports: {
      imported_func: arg => {
        console.log(arg);
      }
    }
  }

// let mod = new WebAssembly.Module(source)
const runner = async () => {
  // const wasm = await WebAssembly.compile(fs.readFileSync('./add.wasm'));
  WebAssembly.instantiate( new Uint8Array(typedArray), {
    env: env,
    wasi_snapshot_preview1: wasi.wasiImport
  }).then(result => {
    console.log("resut", result.instance.exports)
    wasi.start(result.instance)
  }).catch(e => {
    console.log("error", e);
  });
}

runner()
// run: node --experimental-wasi-unstable-preview1 wasmRunner.js 
// https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/
// https://stackoverflow.com/questions/60506961/compileerror-webassembly-compile-expected-magic-word
