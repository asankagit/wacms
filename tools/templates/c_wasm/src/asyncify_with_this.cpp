#include <stdio.h>
#include <emscripten.h>
#include <string>
#include <math.h>

using namespace std; 

// extern void call_mine(string c);

// void hello(char *array) {
//     const char* my_string = "Hello from C++!";
//     memcpy(array, my_string, strlen(my_string));
// }

EM_ASYNC_JS(string, _fetch, (char* url, int size), {

  out("waiting for a fetch", url);

  
  const response = await fetch("http://localhost:8080").then(res => res.buffer())
    .then(json => json.toString());

  out(response);
  out("got the fetch response");
  // (normally you would do something with the fetch here)
  return response;
});

int getStrlen(char* str){
  return strlen(str);
}

string do_fetch(string url, string method)
{
  int n = url.length();
  char memBuff[n + 1];
  // strcpy(char_array, url.c_str());
  char s[5]={'s','a','\0','c','h'};
  // call_mine("url");
  memcpy(memBuff, s, n);
  string response = _fetch(memBuff, 5);
  return "response";
}

string  add_another_file() {
    return "str";
}
// emcc -I.  -Iinclude src/asyncify_with_this.cpp src/__function__.cpp  -O3 -s ASYNCIFY 
