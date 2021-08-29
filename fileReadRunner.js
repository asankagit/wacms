'use strict';
const fs = require('fs');
const  { argv, env } = require('process');

const { WASI } = require('wasi');
const wasi = new WASI({
  args: process.argv,
  env: process.env || {
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
  },
  memory: new WebAssembly.Memory({initial:10, maximum:100})
});

const importObject = {wasi_snapshot_preview1: wasi.wasiImport, env: { memory: new WebAssembly.Memory({initial:10, maximum:100}),log: Math.log}};

(async () => {
  try {
    const wasm = await WebAssembly.compile(fs.readFileSync('envTest.wasm'));
    // console.log(importObject)
    const instance = await WebAssembly.instantiate(wasm, importObject);
  
  
    // const result = instance.exports.test(2)
    console.log(instance.exports.test(1))
    wasi.initialize(instance);
    // wasi.start(instance);
  }
  catch(e) {
    console.log(e)
  }
})();

//   document
// https://docs.w3cub.com/node/wasi
//   https://stackoverflow.com/questions/44097584/webassembly-linkerror-function-import-requires-a-callable

// run 
// node --experimental-wasi-unstable-preview1 envTestWasiRunner.js