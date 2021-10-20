const fetch = require("node-fetch");
const a = require('../../../src/tmp/student')
const myclass = require("../../../src/tmp/myclass")
const { EventEmitter } = require("events")

global.fetch = fetch
global.call_mine = (num) => console.log("this is mine", num)
global.print = (print) => console.log(print)

// Object.call(a, fetch)
a.run()
const responseEmitter = new EventEmitter()

a['onRuntimeInitialized'] = () => {
    const student = new a.Student()
    student.setName("hello from JS host;method:get;")
    const lerp = a.lerp()
    // console.log(`this is learp${lerp} -end lerp`)
    console.log(student.getName())
    console.timeEnd("___wasm_module___")
}

// let instance
// setTimeout(() => {
//   instance = a.onRuntimeInitialized()
//   // console.log(instance)
//   console.timeEnd("___wasm_module___")
// }, 1000);
console.time("___wasm_module___")


myclass['onRuntimeInitialized'] =async  () => {
  // setTimeout(() => {
    const clz = new myclass.SubClass();

    clz.setName('JSON.stringify({d:"d"})')
    await clz.getName()
    clz.setName(myclass.my_fetch_res)
    const response = await clz.getName()
    console.log("bse", response, "\n", /* myclass.my_fetch_res */)

    // responseEmitter.once('event', () => { console.log("emitted")})
    responseEmitter.emit("wasm_response", response)

  // }, 0);

}

export default {
  run: () => {
    return new Promise((resolve, reject) => {
      responseEmitter.once('wasm_response', (response) => resolve(response))
      responseEmitter.once('error', (error) => reject(error))
    })
    
  }
}
// Todo
// https://github.com/emscripten-core/emscripten/issues/11899