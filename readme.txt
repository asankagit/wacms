emcc -s WASM=1 -s SIDE_MODULE=1 -O2 str.c -o str.js
wasm-dis str.wasm -o str.wast

em++  main.c -o main.wasm -s WASM=1 -o main.wat -g  -O3 -s ENVIRONMENT=node

better to use this with,  WASM_EXPORT
em++  main.cpp -o main.wasm -s WASM=1

node --experimental-wasi-unstable-preview1 wasiRunner.js 

/* update emcc
go to emsdk folder
get git update
checkout branch main
build
set source -> source ./emsdk_env.sh
check emm --version
*/



webpack + broswer+ wasm
https://gist.github.com/surma/b2705b6cca29357ebea1c9e6e15684cc

// "build:codec": "docker run --rm -v $(pwd):/src trzeci/emscripten emcc -O3 -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='[\"cwrap\"]' -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s 'EXPORT_NAME=\"fibonacci\"' -o ./fibonacci.js fibonacci.c",


bind
https://stackoverflow.com/questions/21816960/how-to-pass-strings-between-c-and-javascript-via-emscripten


egghead - read wasm memory 
https://egghead.io/lessons/angular-1-x-read-webassembly-memory-from-javascript
https://github.com/guybedford/wasm-intro

export all functions
-s EXPORT_ALL=1


https://gist.github.com/kripken/59c67556dc03bb6d57052fedef1e61ab
 for ,
 const env = {
    'abortStackOverflow': _ => { throw new Error('overflow'); },
    'table': new WebAssembly.Table({ initial: 0, maximum: 0, element: 'anyfunc' }),
    '__table_base': 0,
    'memory': memory,
    '__memory_base': 1024,
    'STACKTOP': 0,
    'STACK_MAX': memory.buffer.byteLength,
  };


  toDo convert pointer to strings
  https://stackoverflow.com/questions/41353389/how-can-i-return-a-javascript-string-from-a-webassembly-function

  get c++  string from js
  https://stackoverflow.com/questions/61795187/webassembly-return-string-use-c

  js array to c++
  https://stackoverflow.com/questions/41875728/pass-a-javascript-array-as-argument-to-a-webassembly-function

  llvm 
  https://surma.dev/things/c-to-webassembly/

  asyncify
  https://web.dev/asyncify/


  file system
  https://emscripten.org/docs/api_reference/Filesystem-API.html?highlight=file%20read

  #include <stdio.h>
#include <emscripten.h>

int main() {
  MAIN_THREAD_EM_ASM(
  FS.writeFile('file', 'foobar');
  FS.symlink('file', 'link');
  console.log(FS.readlink('link'));
  );
  return 0;
}



js callbacks to c++
https://emscripten.org/docs/api_reference/val.h.html
https://stackoverflow.com/questions/36371178/embind-pass-lambda-function-as-callback-parameter



// readings
// https://medium.com/@penberg/on-kernel-bypass-networking-and-programmable-packet-processing-799609b06898
// https://www.intel.com/content/www/us/en/developer/articles/technical/minimize-nodejs-io-bottlenecks.html
// https://www.npmjs.com/package/pcap
// https://stackoverflow.com/questions/18343365/zero-copy-networking-vs-kernel-bypass - pcap 
// https://filipjaniszewski.com/2018/05/26/including-dpdk-libs-into-your-c-project/

// dpdk- research gate artickle
// https://www.researchgate.net/publication/299489473_Enhancing_VNF_performance_by_exploiting_SR-IOV_and_DPDK_packet_processing_acceleration/figures?lo=1


libpcap should be locally installed
sudo apt-get install libpcap-dev

cpp lib and header
https://www.daniweb.com/programming/software-development/threads/473176/vector-is-different-for-every-class-instance



// https://sendilkumarn.com/blog/wasi-with-wasmtime/ 
// curl https://wasmtime.dev/install.sh -sSf | bash
// install nightly toolchain
// rustup toolchain install nightly

// install wasm32-wsi li
// rustup target add wasm32-wasi --toolchain nightly

// rustup target add wasm32-wasi --toolchain nightly
// cargo +nightly build --target wasm32-wasi