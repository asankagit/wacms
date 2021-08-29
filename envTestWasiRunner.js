const fetch = require("node-fetch");
const fs = require('fs');

const { WASI } = require('wasi');
const wasi = new WASI({
  args: process.argv,
  env: {
    memoryBase: 0,
    tableBase: 0,
    memory: new WebAssembly.Memory({
      initial: 256,
      maximum: 512,
    }),
    table: new WebAssembly.Table({
      initial: 0,
      maximum: 0,
      element: 'anyfunc',
    }),
    log: Math.log,
  },
  preopens: {
    '/sandbox': "/"
  }
});


async function loadWebAssembly(filename, imports = {}) {
    const wasmInstance = await WebAssembly.compile(fs.readFileSync(filename))
      .then((module) => {
        imports.env = imports.env || {}
        Object.assign(imports.env, {
          memoryBase: 0,
          tableBase: 0,
          memory: new WebAssembly.Memory({
            initial: 256,
            maximum: 512,
          }),
          table: new WebAssembly.Table({
            initial: 0,
            maximum: 0,
            element: 'anyfunc',
          }),
          log: Math.log,
        })
        return new WebAssembly.Instance(module, imports)
      })
      .catch(e => console.log(e))

    // wasi.start(wasmInstance)
     return wasmInstance.exports.test(1)
  }

  const wasmfun = loadWebAssembly('envTest.wasm').then(e => console.log("outter result", e))
  console.log(wasmfun)


//   document
//   https://stackoverflow.com/questions/44097584/webassembly-linkerror-function-import-requires-a-callable

// run 
// node --experimental-wasi-unstable-preview1 envTestWasiRunner.js