// example.cpp
#include <emscripten.h>
#include <stdio.h>

// start_timer(): call JS to set an async timer for 500ms
EM_JS(void, start_timer, (), {
  Module.timer = false;
  setTimeout(function() {
    Module.timer = true;
  }, 500);
});

// check_timer(): check if that timer occurred
EM_JS(bool, check_timer, (), {
  return Module.timer;
});

int main() {
  start_timer();
  // Continuously loop while synchronously polling for the timer.
  while (1) {
    if (check_timer()) {
      printf("timer happened!\n");
      return 0;
    }
    printf("sleeping...\n");
    emscripten_sleep(100);
  }
}
