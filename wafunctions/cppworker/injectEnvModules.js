

const fetch = require("node-fetch");
const fs = require('fs');
// const myclass = require("./myclass")
const { astReader } = require("../../ast-parse")
const { WASI } = require('wasi');
const path = require("path")


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



async function loadWebAssembly(filename, imports = {}, injectableFunctions = []) {
    const wasmInstance = await WebAssembly.compile(fs.readFileSync(filename))
      .then((module) => {
        imports.env = imports.env || {}
        imports.wasi_snapshot_preview1 = wasi.wasiImport,
        Object.assign(imports.env, {
          memoryBase: 1024,
          tableBase: 0,
          memory: new WebAssembly.Memory({
            initial: 256,
            maximum: 512 * 4,
          }),
          table: new WebAssembly.Table({
            initial: 0,
            maximum: 0,
            element: 'anyfunc',
          }),
          _embind_register_class: (x) => x,
          _embind_register_class_function: (m) => m,
          _embind_register_class_constructor: (x) => x,
          ...injectableFunctions
        })

        const arrayBuffer = imports.env.memory.buffer;
        const buffer = new Uint8Array(arrayBuffer);
        console.log("buffer", buffer.filter(i => i !== 0))
        console.log("buffer", buffer[1024])
        try{

        
        const instance = new WebAssembly.Instance(module, imports)
        console.log({ instance })
        const { exports: { memory } } = instance
        const array = new Uint8Array(arrayBuffer, 0, 15);
        console.log("array", { array })
        // hello(array.byteOffset);
        console.log(new TextDecoder('utf8').decode(array));
        return instance
        }
        catch(e){
          console.log(e)
        }
      })
      .catch(e => console.log(e))

     
    console.log("exports", wasmInstance.exports)
    // wasi.start(wasmInstance)
    //  return wasmInstance.exports.test(10)
    return wasmInstance.exports
  }


  // readline.question(`What's your name?`, name => {
  //   console.log(`Hi ${name}!`)
  //   wasiFileName = name
  //   const wasmfun = loadWebAssembly(`${wasiFileName}.wasm`).then(e => console.log("outter function calling...", e.main(10)))
  //   readline.close()
  // })


  
const readAST = async () => {
  try {
  const emccOutputFilePath = path.join(__dirname, "./dist/support.js")
  const astData = await astReader(emccOutputFilePath)
  // astData.map( n => console.log(n))
  console.log("ast done", astData[0]())
  const wasmfun = loadWebAssembly("./dist/myclass_optimized.wasm", {}, astData).then(e => console.log("outter function calling...",e))
  }
  catch(e) {
    console.log(e)
  }

}
readAST()
// const wasmfun = loadWebAssembly("myclass.wasm").then(e => console.log("outter function calling...",e))


// console.log(Object.keys(myclass))

// node --experimental-wasi-unstable-preview1  injectEnvModules.js
// Not success; issue with import.env modules; no need to try; webpack build succeed for wasmer file.