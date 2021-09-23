var express = require('express');
const app = express()
const { spawn } = require("child_process") //equal to const spawn = require('child_process').spawn
app.get("/ls", (req, res) => {
  const ls = spawn("ls", ["-lash", req.query.directory])
  ls.stdout.on("data", data => {
    //Pipe (connection) between stdin,stdout,stderr are established between the parent
    //node.js process and spawned subprocess and we can listen the data event on the stdout
    res.write(data.toString()) //date would be coming as streams(chunks of data)
    // since res is a writable stream,we are writing to it
  })
  ls.on("close", code => {
    console.log(`child process exited with code ${code}`)
    res.end() //finally all the written streams are send back when the subprocess exit
  })
})


// with fork
const { fork } = require("child_process")
app.get("/isprime", (req, res) => {
  const childProcess = fork("./forkedchild.js") //the first argument to fork() is the name of the js file to be run by the child process
  childProcess.send({ number: parseInt(req.query.number) }) //send method is used to send message to child process through IPC
  const startTime = new Date()
  childProcess.on("message", message => {
    //on("message") method is used to listen for messages send by the child process
    const endTime = new Date()
    res.json({
      ...message,
      time: endTime.getTime() - startTime.getTime() + "ms",
    })
  })
})
app.get("/testrequest", (req, res) => {
  res.send("I am unblocked now")
})

//s*forkedchild.js
process.on("message", message => {
Copy
  //child process is listening for messages by the parent process
  const result = isPrime(message.number)
  process.send(result)
  process.exit() // make sure to use exit() to prevent orphaned processes
})
function isPrime(number) {
  let isPrime = true
  for (let i = 3; i < number; i++) {
    if (number % i === 0) {
      isPrime = false
      break
    }
  }
  return {
    number: number,
    isPrime: isPrime,
  }


app.listen(7000, () => console.log("listening on port 7000"))

