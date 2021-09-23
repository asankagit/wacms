#include <math.h>
#include <string>



using namespace std;

void consoleLog (string num);
void printStrig (string str);
string netCall (string url);

float getSqrt (float num, string str) {
  consoleLog("str");
  printStrig("pass string");
  string data = netCall("http://example.com");
  printf("s");
  return sqrt(num);
}


void hello(char *array) {
    const char* my_string = "Hello from C++!";
    memcpy(array, my_string, strlen(my_string));
}

int main(int argc, char* argv[]) {
  return 0;
}

// https://github.com/guybedford/wasm-intro
// https://stackoverflow.com/questions/61795187/webassembly-return-string-use-c
//  need side_module flag
// em++ src/tmp.cpp -Os -s WASM=1 -s SIDE_MODULE=1 -o tmp.wasm