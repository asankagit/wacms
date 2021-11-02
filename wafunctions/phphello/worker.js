
const { parentPort, workerData } = require("worker_threads")
const fs = require('fs')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var CustomEvent = require('custom-event');

var jsdom = require('jsdom');
// const jsdom from 'jsdom';
const {JSDOM} = jsdom;  

const dom = new JSDOM(`
<!DOCTYPE html>
<html lang="en">
<head>
    <title>hello jsdom </title>
</head>
<body>
    <h1>Hi </h1>
</body>
`, {

    url: "https://example.org/",
    referrer: "https://example.com/",
    contentType: "text/html",
    includeNodeLocations: true,
});

global.window = dom.window;
global.document = dom.window.document;  
// console.log(dom.window.document.createEvent)

global.XMLHttpRequest =XMLHttpRequest
// global.CustomEvent = CustomEvent

const { PhpWeb } = require('php-wasm/PhpWeb');
const php = new PhpWeb;

const fileReadPromise = () =>  new Promise((resolve, reject) => {
    fs.readFile("./src/index.php", 'utf8', (err, data) => {
        if (err) {
          console.error(err)
          reject(err)
          return
        }
        resolve(data)
    })
})

php.addEventListener('ready', async() => {
    const scriptStr = await fileReadPromise()
	php.run(scriptStr).then(retVal => {
		// retVal contains the return code.
        parentPort.postMessage(retVal)
	});
});