// example.cpp
#include <emscripten.h>
#include <stdio.h>
#include "asyncify_with_this.h"

// start_timer(): call JS to set an async timer for 500ms
// EM_JS(void, start_timer, (), {
//   Module.timer = false;
//   call_mine();
//   setTimeout(function() {
//     Module.timer = true;
//   }, 500);
// });

// // check_timer(): check if that timer occurred
// EM_JS(bool, check_timer, (), {
//   return Module.timer;
// });

// int main() {
//   start_timer();
//   // Continuously loop while synchronously polling for the timer.
//   while (1) {
//     if (check_timer()) {
//       printf("timer happened!\n");
//       return 0;
//     }
//     printf("sleeping...\n");
//     emscripten_sleep(100);
//   }
// }

// example.c
// #include <emscripten.h>
// #include <stdio.h>

EM_ASYNC_JS(int, do_fetch, (int num), {
  out("waiting for a fetch");

  call_mine(num);
  const response = await fetch("http://api.plos.org/search?q=title:DNA").then(res => res.buffer())
    .then(json => json.toString());;

  out(response);
  out("got the fetch response");
  // (normally you would do something with the fetch here)
  return 42;
});

int main() {
  puts("before");
  int someNumber = add_another_file();
  do_fetch(someNumber);
  puts("after");
}

// emcc asyncify.cpp  asyncify_with_this.cpp -O3 -o async.js async.wasm -s ASYNCIFY

//emcc asyncify.cpp  asyncify_with_this.cpp -O3  -s ASYNCIFY -o async.wasm -o async.js
