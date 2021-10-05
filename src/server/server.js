const express = require('express')
const app = express()
const port = 3000
import { isMainThread, Worker, parentPort, workerData } from "worker_threads"

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/wasm", (req,res) => {
    const workers = []

        const callback = (data) => {
            console.log("callbakc", data)
            // workers[0].postMessage("fire")
            // workers[1].postMessage("fire")

            console.log(">>>", { data })
            res.send(data)

            workers[0].removeListener("message", callback)
            workers[1].removeListener("message", callback)
            workers[0].unref()
            workers[1].unref()
        }

        const worker_path = "./dist/worker.generated.js"
        const createWorker = (id, index) => {
            const worker = new Worker(worker_path, { workerData: { id, index } })
            worker.on("error", err => { throw err })
            worker.on("message", callback)
            return worker
        }
        workers[0] = createWorker("id0", 0)
        workers[1] = createWorker("id1", 1)

        workers[0].postMessage("fire")
        workers[1].postMessage("fire")


        // res.send("ok")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
