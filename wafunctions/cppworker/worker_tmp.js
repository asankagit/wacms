
const { parentPort, workerData } = require("worker_threads")
const  wasm_sample = require("./wasmer")


const { id, index, req } = workerData

wasm_sample.run({ req }).then(cl => {
    // console.log("wasm_sample_run", cl, "wnd")
    parentPort.postMessage(cl)
}).catch()
