
import { parentPort, workerData } from "worker_threads"
import wasm_sample from "./wasmer"

wasm_sample.run().then(cl => {
    console.log("wasm_sample_run", cl, "wnd")
    parentPort.postMessage(cl)
}).catch()
