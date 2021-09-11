const fetch = require("node-fetch");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const a = require('./a.out.js')

function MyFetch() {
  this.mockResponseText = "_mock_data_"
  XMLHttpRequest.call(this)
  // return { 
  //   open: (x, y) => {
  //     console.log("open", x, y)
  //     // return 400
  //   },
  //   addEventListener: (x, y ) => { 
  //     console.log("listener", x, y)
  //     setTimeout((xz) => y("nnnnnn"), 3000)
  //     y()
  //   },
  //   send: (x) => console.log("hhh",x),
  //   onreadystatechange: (x) =>  { console.log("on stat change", x); return 500}
  // }
}


// console.log(Myfetch());
//-----------------------------------------------------
// function reqListener () {
//   console.log("register", this.responseText);
// }

// var oReq = new MyFetch();
// oReq.addEventListener("load", reqListener);
// oReq.open("GET", "https://httpbin.org/get");
// oReq.send();
// -----------------------------------------------


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

global.strlenx=(url, ...rest) => {
    console.log("strlen", url, rest)
    return url
  }
// Object.call(a, fetch)


global.XMLHttpRequest = MyFetch


a.run()

// console.log(global)

// const sum = new Function('a', 'b', 'return a + b');
// console.log(sum(2, 6));