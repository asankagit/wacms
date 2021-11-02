import { PhpWeb as PHP } from 'php-wasm/PhpWeb';
import { parentPort, workerData } from "worker_threads"
const fs = require('fs')
const MockBrowser = require('mock-browser').mocks.MockBrowser;
const AbstractBrowser = require('mock-browser').delegates.AbstractBrowser;

global.window =  MockBrowser.createWindow();
const browser = new AbstractBrowser({});
global.document = browser.getDocument(); 
const php = new PHP;

const fileReadPromise = () =>  new Promise((resolve, reject) => {
    fs.readFile("./scripts/index.php", 'utf8', (err, data) => {
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