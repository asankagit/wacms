// const fetch = require("fetch").default;
// const fetch = require("node-fetch")
// const a = require('../../src/tmp/student')
// let myclass = require("./myclass")
const { EventEmitter } = require("events");
const { Module } = require("module");


global.fetch = (url) => { 
  // console.log({ url })
  return fetch(url)
}
// console.log({ Module }, myclass.ENV)
global.call_mine = (num) => console.log("this is mine", num)
global.print = (print) => console.log(print)

const responseEmitter = new EventEmitter()

console.time("___wasm_module___")

function jsMethodAgrs(title, msg) {
  console.log(">><<jsMethodAgrs", title + '\n' + msg);
  return "this is sent from JS host "
}

global.jsMethodAgrs =jsMethodAgrs

myclass['onRuntimeInitialized'] =async  () => {
  myclass.customFetch();
  myclass.callJsBackWithAgrs();
  // console.log({ myclass })
  // setTimeout(() => {
    const clz = new myclass.SubClass();

    clz.setName('JSON.stringify({d:"d"})')
    await clz.getName()
    clz.setName(myclass.my_fetch_res)
    const response = await clz.getName()
    // console.log("bse", response, "\n", /* myclass.my_fetch_res */)

    // responseEmitter.once('event', () => { console.log("emitted")})
    responseEmitter.emit("wasm_response", response)


  // }, 0);

}

module.exports = {
  run: () => {
    return new Promise((resolve, reject) => {
      responseEmitter.once('wasm_response', (response) => resolve(response))
      responseEmitter.once('error', (error) => reject(error))
    })
    
  }
}
// Todo
// https://github.com/emscripten-core/emscripten/issues/11899

// this is working without packaging
// @ToDo packed version has "fetch" is not a function isssue