const { EventEmitter } = require("events");
const { Module } = require("module");

class Request {
  constructor({ params, body, query, method }) {
    this.params= params
    this.body = body
    this.query = query
    this.method = method
  }

  req = () => {
    return { 
      params: this.params,
      body:this.body,
      query: this.query,
      method: this.method
    }
  }
  start = () => {

    ASM_JS['onRuntimeInitialized'] = async  () => {
        ASM_JS.my_fetch_res = ""
        const clz = new ASM_JS.SubClass();
        // clz.setName(ASM_JS.my_fetch_res)
        clz.setContext(JSON.stringify(this.req()))
        const response = await clz.getCallback()
        responseEmitter.emit("wasm_response", response)
        clz.delete()
    }
  }


  
}

global.fetch = (url) => { 
  return fetch(url)
}

global.call_mine = (num) => console.log("this is mine", num)
global.printf = (print) => console.log("printf blocked")

const responseEmitter = new EventEmitter()

console.time("___wasm_module___")

function jsMethodAgrs(title, msg) {
  // console.log(">><<jsMethodAgrs", title + '\n' + msg);
  return "this is sent from JS host "
}

global.jsMethodAgrs =jsMethodAgrs



module.exports = {
  run: ({ req }) => {
    const request = new Request({ ...req })
    request.start()
    return new Promise((resolve, reject) => {
      responseEmitter.once('wasm_response', (response) => resolve(response))
      responseEmitter.once('error', (error) => reject(error))
    })
    
  }
}
