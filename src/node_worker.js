const { Worker } = require('worker_threads');

const fs = require('fs');

var source = fs.readFileSync('/home/asanka/Documents/learn/emscripten_test_folder/wasmRunner.js', 'utf8');
// console.log(source)
const worker = new Worker(
    source
//     `
// const { parentPort } = require('worker_threads');
// const util = require('util');
// const setTimeoutPromise = util.promisify(setTimeout);


// const doAndSleep =  (i) => {
   
//     setTimeoutPromise(1000 * i , i).then((value) => {
//         console.log("val", i)
//     });

//     console.log(">>", i)
// }
// for(var i = 0; i < 10; i++) {
//     // console.log(i)
//    doAndSleep(i)
// }
// parentPort.once('message',
//     message => parentPort.postMessage({ pong: message }));  
// `
, { eval: true });

setTimeout(() => worker.terminate(),8000)
worker.on('message', message => console.log(message));      
worker.postMessage('ping');  