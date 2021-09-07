#include <emscripten.h>
#include <stdio.h>
#include "include/asyncify_with_this.h"
#include <string>

using namespace std;

int main(){
    puts("before");
    string str = add_another_file();
    // string url = "http://api.plos.org/search?q=title:DNA";
    string response = do_fetch("http://api.plos.org/search?q=tittle:DNA","post");
    printf("%s", response.c_str());
    puts("after");
}

// emcc asyncify.cpp  asyncify_with_this.cpp -O3 -o async.js async.wasm -s ASYNCIFY

//emcc asyncify.cpp  asyncify_with_this.cpp -O3  -s ASYNCIFY -o async.wasm -o async.js