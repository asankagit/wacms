#include <math.h>
#include <string>


using namespace std;

void consoleLog (float num);
void printStrig (string str);
string netCall (string url);

float getSqrt (float num) {
  consoleLog(num);
  printStrig("pass string");
  string data = netCall("http://example.com");
  printf("s");
  return sqrt(num);
}

void hello(char *array) {
    const char* my_string = "Hello from C++!";
    memcpy(array, my_string, strlen(my_string));
}


// https://github.com/guybedford/wasm-intro
// https://stackoverflow.com/questions/61795187/webassembly-return-string-use-c