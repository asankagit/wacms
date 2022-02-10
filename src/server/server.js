const express = require('express')
const app = express()
const port = 3000
import { isMainThread, Worker, parentPort, workerData } from "worker_threads"
import { performance,  PerformanceObserver } from 'perf_hooks'
const workerpool = require('workerpool');
const statusMonitor = require('express-status-monitor');

const pool = workerpool.pool(`./wafunctions/zxc/dist/wasmer_host_function.generated.js`)

const memoryStatlogger = (req, res, next) => {
  const heapUsed = process.memoryUsage().heapUsed / 1024 / 1024; // MB
  const rss = process.memoryUsage()
  console.log(
    heapUsed,
);
  next()
}
const runWorkers = (req) => {
  // console.log("innner lof-,", req)
  pool.exec('fibonacci', [req])
    .then((result) => {
      console.log({ result })
    })
    .catch((err) => {
      console.log(err)
    })
    //
}


app.use(statusMonitor());
app.use(memoryStatlogger);

app.get('/', (req, res) => {
  console.log("/")
  res.send('Hello World!')
})

app.use('/worker', (req, res) => {
  const { params, body, query, method, ...rest } = req
  runWorkers({ params, body, query, method })
  res.send("")
})
// app.get("/wasm/:wafuz", 
const wasmInvokeFun = (req,res) => {
    const { params: { wafuz } } = req
    const workers = []

        const callback = (data) => {
            // console.log("callbakc", data)
            // workers[0].postMessage("fire")
            // workers[1].postMessage("fire")
            res.send({ data })

            workers[0].removeListener("message", callback)
            // workers[1].removeListener("message", callback)
            workers[0].unref()
            // workers[1].unref()
        }

        const worker_path = `./wafunctions/${wafuz}/dist/wasmer_host_function.generated.js`
        const createWorker = (id, index) => {
            const { params, body, query, method, ...rest } = req
            const worker = new Worker(worker_path, { workerData: { id, index, req: { params, body, query, method } } })
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
        }, 30000)
        // res.send("ok")
}
// )

// const wrapped = performance.timerify(wasmInvokeFun);

// const obs = new PerformanceObserver((list) => {
//   console.log("duration", list.getEntries()[0].duration);
//   obs.disconnect();
// });
// obs.observe({ entryTypes: ['function'] });

app.get("/wasm/:wafuz", wasmInvokeFun /*wrapped*/)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
