#include <math.h>
#include <string>
#include <emscripten.h>



// EMSCRIPTEN_KEEPALIVE
int fib(int n) {
  int i, t, a = 0, b = 1;
  for (i = 0; i < n; i++) {
    t = a + b;
    a = b;
    b = t;
  }
  return b;
}

// extern std::string mylogger(std::string c);


// std::string printLogger(std::string iStr) {

//   std::string str1 = "Hello";
//   // std::string str = mylogger(str1);
//   return  str1;
// }

double test(int v) {
  double db = log(v);
  return db;

}
// compile: emcc envTest.c -Os -s WASM=1 -s SIDE_MODULE=1 -o envTest.wasm

// from :
// https://stackoverflow.com/questions/44097584/webassembly-linkerror-function-import-requires-a-callable