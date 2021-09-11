const fetch = require("node-fetch");
const a = require('./async.js')
global.fetch = fetch
global.call_mine = (num) => console.log("this is mine", num)
// Object.call(a, fetch)
a.run()
console.log(global)