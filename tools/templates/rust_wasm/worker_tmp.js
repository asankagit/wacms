import { parentPort, workerData } from "worker_threads"
import { exit } from "process"
import { readFile, readFileSync } from "fs"
import fs from "fs"
var path_module = require('path');
const { spawn } = require("child_process")
const vm = require('vm');
const http = require('http')
const wasmer_wasi = require('@wasmer/wasi');
const wasmer_fs = require("@wasmer/wasmfs")
const wasm_transformer = require("@wasmer/wasm-transformer")
const wasm_binding  = require("@wasmer/wasi/lib/bindings/node")
import wasm_sample from "./wasmer"

wasm_sample.run().then(cl => {
    console.log("wasm_sample_run", cl, "wnd")
    parentPort.postMessage(cl)
 }).catch()

// const dynamic_link = "wasmer"
// import(/* webpackMode: "eager" */ `../tmp/${dynamic_link}`).then(wasm_sample =>
//     // console.group(Object.keys(wasm_sample), wasm_sample.default)
//     wasm_sample.default.run().then(cl => {
//         console.log("wasm_sample_run", cl, "wnd")
//         parentPort.postMessage(cl)
//      }).catch()
// ).catch(module_err =>  {
//     console.log(module_err)
// })

parentPort.postMessage("cl")

const context = {
  animal: 'cat',
  count: 2,
  require: (mdl) => {
    console.log(">><", mdl)
    switch (mdl) {
        case "@wasmer/wasmfs":
            return wasmer_fs
        case "@wasmer/wasi":
            return wasmer_wasi
        case  "@wasmer/wasm-transformer":
            return wasm_transformer
        case "@wasmer/wasi/lib/bindings/node":
            return wasm_binding
        case "fs":
            return fs
        default:
            return require(mdl)
    }

  },
  "module": module,

};

// const myVM = getScriptObject("./wasmer.generated.js")
function getScriptObject(scriptFilename) {
    var sandbox = {
        "module": module, "result": false,
        "require": requireShim, "console": console
    };

    var script = vm.createScript(fs.readFileSync(scriptFilename));
    script.runInNewContext(sandbox);
    return sandbox.result;
}

function requireShim(x) {
    console.log("requireShim: " + x);
    return require(x);
}

// const code = `
// ((http) => {
//   //const http = require('http');

//   http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'text/plain' });
//     response.end('Hello World\\n');
//   }).listen(1234);

//   console.log('Server running at http://127.0.0.1:1234/');
// })`;


// readFile("/home/asanka/Documents/learn/webAssemblyPalygroud/wacms/src/tmp/wasmer.js", 'utf8', (err, code) => {
//     if (err) {
//         console.log(err)
//         exit()
//         throw Error("file read error")
//     }
//     if (code) {
//         const script = new vm.Script(code);
//         vm.createContext(context);
//         script.runInContext(context);
//         console.log({ context })
//         parentPort.postMessage(context)
//     }
// })



const readCommand = (callback) => {
    const ls = spawn("echo", ["console.log('hi')"])
    ls.stdout.on("data", data => {
        console.log({ data })
        callback(data.toString() + JSON.stringify(context))
    })
    ls.on("close", code => {
        console.log(`child process exited with code ${code}`)
        callback(code)
    })
}


const filePath = "/home/asanka/Documents/learn/webAssemblyPalygroud/wacms/dist/wasmer.generated.js"
console.log(" parentPort", parentPort)
// parentPort.postMessage({ msg: "worker started" })

function LoadModules(path) {
    fs.lstat(path, function(err, stat) {
        if (stat?.isDirectory()) {
            // we have a directory: do a tree walk
            fs.readdir(path, function(err, files) {
                var f, l = files.length;
                for (var i = 0; i < l; i++) {



                    f = path_module.join(path, files[i]);
                    // console.log(files[i], f)
                    LoadModules(f);


                }
            });
        } else {
            // we have a file: load it
            // console.log({ path })
            if (path === "/home/asanka/Documents/learn/webAssemblyPalygroud/wacms/dist/wasmer.generated.js") {
                // require(path)(module_holder);
            }
        }
    });
}

const DIR = path_module.join(__dirname);
LoadModules(DIR);

parentPort.on("message", async (msg) => {
    if (msg === "terminate") {
        exit(1)
    }
    if (msg === "next") {
        parentPort.postMessage({ msg: {}})
    }
    if (msg === "fire") {
        console.log(" worker got fire")
        // parentPort.postMessage(getScriptObject(__dirname + "/wasmer.generated.js"))
        // filePath()
        // readCommand(x => parentPort.postMessage(x))


        // await readFile(filePath, 'utf8', (err, data) => {
        //     if (err) {
        //         console.log(err)
        //         exit()
        //         throw Error("file read error")
        //     }
        //     if (data) {
                // const script = new vm.Script('1222 ');
                // vm.createContext(context);
                // script.runInContext(context);
                // console.log({ context })
                // parentPort.postMessage(context)
        //     }
        //     // console.log("worker data", data.toString())

        //     // data.then(strm => {
        //     //     parentPort.postMessage({ msg: data })
        //     // }).catch(e => {
        //     //     throw Error("file read error")
        //     // })

        //     // console.log("data",data)
        // })
    }
})


// dynamic require with VM :https://nodejs.org/docs/latest-v15.x/api/vm.html#vm_script_runincontext_contextifiedobject_options
