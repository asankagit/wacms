
const fs = require('fs');
const WASIwrapper = require('wasi')
const  { argv, env } = require("process")

const { WASI } = WASIwrapper

console.log(">>", WASIwrapper)
const putc_js = (c) => console.log(c)

const wasi = new WASI({
  args: [],
  env:{
    memory: new WebAssembly.Memory({ initial: 256 }),
    table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
    _putc_js: putc_js
  },
  preopens: {
    '/sandbox': "/",
  }
});

const runner = async () => {
  try {

    const importObject = { wasi_snapshot_preview1: wasi.wasiImports };
    const wasm = await WebAssembly.compile(fs.readFileSync('./main.wasm'));
    // console.log("wasm", wasm)
    const instance = await WebAssembly.instantiate(wasm, importObject);
    // console.log(wasi.start(wasm))
    wasi.start(instance)
    // instance.then(result => console.log(result)).catch(e => console.log(e))
    // console.log("runner", wasi.start({}))
  } catch (e) {
    console.log(e)
  }
}

runner()