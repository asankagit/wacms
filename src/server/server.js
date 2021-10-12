const express = require('express')
const app = express()
const port = 3000
import { isMainThread, Worker, parentPort, workerData } from "worker_threads"
import { performance,  PerformanceObserver } from 'perf_hooks'

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// app.get("/wasm/:wafuz", 
const wasmInvokeFun = (req,res) => {
    const { params: { wafuz } } = req
    const workers = []

        const callback = (data) => {
            console.log("callbakc", data)
            // workers[0].postMessage("fire")
            // workers[1].postMessage("fire")

            console.log(">>>", { data })
            res.send(data)

            workers[0].removeListener("message", callback)
            // workers[1].removeListener("message", callback)
            workers[0].unref()
            // workers[1].unref()
        }

        const worker_path = `./wafunctions/${wafuz}/dist/wasmer_host_function.generated.js`
        const createWorker = (id, index) => {
            const worker = new Worker(worker_path, { workerData: { id, index } })
            worker.on("error", err => { console.log(err) })
            worker.on("message", callback)
            return worker
        }
        workers[0] = createWorker("id0", 0)
        // workers[1] = createWorker("id1", 1)

        workers[0].postMessage("fire")
        // workers[1].postMessage("fire")

        setTimeout(() => { 
          workers[0].terminate()
          // workers[1].terminate()
        }, 3000)
        // res.send("ok")
}
// )

const wrapped = performance.timerify(wasmInvokeFun);

const obs = new PerformanceObserver((list) => {
  console.log("duration", list.getEntries()[0].duration);
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });
app.get("/wasm/:wafuz", wasmInvokeFun /*wrapped*/)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
