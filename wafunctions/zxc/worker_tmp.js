
// const { parentPort, workerData } = require("worker_threads")
const  wasm_sample = require("./wasmer")


// const { id, index, req } = workerData

// wasm_sample.run({ req }).then(cl => {
//     // console.log("wasm_sample_run", cl, "wnd")
//     parentPort.postMessage(cl)
// }).catch()

const workerpool = require('workerpool');

// a deliberately inefficient implementation of the fibonacci sequence
async function fibonacci(req) {
    try {
        const response = await wasm_sample.run(req)
        return response
    }
    catch(err) {
        return err
    }
    // return new Promise((resolve, reject) => {
    //     console.log("inside worker tmp")
    //     setTimeout(() => resolve("ok"), 2000)
    // })
}

// create a worker and register public functions
workerpool.worker({
  fibonacci: fibonacci
});