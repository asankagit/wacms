const fetch = require("node-fetch");
// const fs = require('fs');
import fs from "fs"

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
    mylogger: function(urlStr) { return "ok"},
  },
  preopens: {
    '/sandbox': "/home/asanka/Documents/learn/webAssemblyPalygroud/wacms/"
  }
});

let wasiFileName = ""
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const global = new WebAssembly.Global({value:'i32', mutable:true}, 0);


async function loadWebAssembly(filename, imports = {}) {
    const wasmInstance = await WebAssembly.compile(fs.readFileSync(filename))
      .then((module) => {
        imports.env = imports.env || {}
        imports.wasi_snapshot_preview1 = wasi.wasiImport,
        Object.assign(imports.env, {
          memoryBase: 1024,
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
          printf: function (x) { console.log(x) },
          mylogger: function (urlStr) { return "ok" },
          appendStringToBody: function (str) {
            console.log("str ffrom rust", str)
            return "hi_wasm"
          },
          _Z10consoleLogf: num => console.log(num),
          _ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev: (url, ...rest) => {
            console.log("url-1", url, rest)
            return "tbody"
          },
          _Z7netCallNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEE: (url, ...rest) => {
            console.log("url-2", url, rest)
            return url
          },
          _ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm: (url, ...rest) => {
            console.log("url-3", url, rest)
            return url
          },
          strlen: (url, ...rest) => {
            console.log("strlen", url, rest)
            return url
          },
          __stack_pointer: global,
          __memory_base: 1024,

          putchar: (url, ...rest) => {
            console.log("putchar", url, rest)
            return url
          },
          _Z10printStrigNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEE: (str, ...rest) => {
            console.log("print string callback", str, rest)
          },
          __wbindgen_placeholder__:  x => conosle.log(x)
        })

        // const arrayBuffer = imports.env.memory.buffer;
        // const buffer = new Uint8Array(arrayBuffer);
        // console.log("buffer", buffer.filter(i => i !== 0))
        // console.log("buffer", buffer[1024])
        console.log(module)
        const instance = new WebAssembly.Instance(module, imports)

        // const { exports: { memory, _Z5helloPc: hello } } = instance
        // console.log({ memory, hello })
        // const array = new Uint8Array(arrayBuffer, 0, 15);
        // hello(array.byteOffset);
        // console.log(new TextDecoder('utf8').decode(array));


        return instance
      })
      .catch(e => console.log(e))

     
    console.log(wasmInstance.exports)
    wasi.start(wasmInstance)
    //  return wasmInstance.exports.test(10)
    return wasmInstance.exports
  }


  // readline.question(`What's your name?`, name => {
  //   console.log(`Hi ${name}!`)
  //   wasiFileName = name
  //   const wasmfun = loadWebAssembly(`${wasiFileName}.wasm`).then(e => console.log("outter function calling...", e.main(10)))
  //   readline.close()
  // })

const wasmfun = loadWebAssembly("fileRead.wasm").then(e => console.log("outter function calling...", e))
// const  wasmfun_printlogger = loadWebAssembly('envTest.wasm').then(e => console.log("outter function call", e._Z11printLoggeri(["3","s"])))
  console.log(wasmfun)


//   document
//   https://stackoverflow.com/questions/44097584/webassembly-linkerror-function-import-requires-a-callable

// run 
// node --experimental-wasi-unstable-preview1 envTestWasiRunner.js

// -s WASM_STANDALONE 