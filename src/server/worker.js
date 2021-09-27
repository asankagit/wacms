import { parentPort, workerData } from "worker_threads"
import { exit } from "process"
import { readFile, readFileSync } from "fs"

const filePath = "/home/asanka/Documents/learn/webAssemblyPalygroud/wacms/wafunctions/hellocpp/src/hello-cpp.cpp"
console.log(" parentPort", parentPort)
// parentPort.postMessage({ msg: "worker started" })
parentPort.on("message", (msg) => {
    if (msg === "terminate") {
        exit(1)
    }
    if (msg === "next") {
        parentPort.postMessage({ msg: {}})
    }
    if (msg === "fire") {
        readFileSync(filePath, 'utf8', (err, data) => {
            if (err) {
                exit()
                throw Error("file read error")
            }
            if (data) {
                parentPort.postMessage({ msg: data })
            }
            console.log("worker data", data)
           
            // data.then(strm => {
            //     parentPort.postMessage({ msg: data })
            // }).catch(e => {
            //     throw Error("file read error")
            // })
            
            console.log("data",data)
        })
    }
})
