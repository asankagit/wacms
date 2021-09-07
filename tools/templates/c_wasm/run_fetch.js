const fetch = require("node-fetch");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const a = require('./a.out.js')

global.fetch = (url) => {
    console.log("global fetch", url)
    return new Promise((res, rej) => setTimeout(() => {
        const buffer = () => new Promise((resolve, reject) => {
            resolve("ok-pass by run_fetch.js")
        })
        res(({ buffer }))
      }, 3000) )
}
console.log({ a })
global.call_mine = (num) => console.log("this is mine", num)
global.strlen=(url, ...rest) => {
    console.log("strlen", url, rest)
    return url
  },
// Object.call(a, fetch)
global.XMLHttpRequest = XMLHttpRequest
a.run()
// console.log(global)