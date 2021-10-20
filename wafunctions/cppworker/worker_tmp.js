
const { parentPort, workerData } = require("worker_threads")
const  wasm_sample = require("./wasmer")

wasm_sample.run().then(cl => {
    console.log("wasm_sample_run", cl, "wnd")
    parentPort.postMessage(cl)
}).catch()
