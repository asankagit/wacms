#include <emscripten/bind.h>
#include <emscripten.h>
#include <stdio.h>
#include <future>
#include "Wafuz.h"

using namespace emscripten;

EM_ASYNC_JS(char*, do_fetch, (const char *url, int lenurl), {
  out("waiting for a fetch");
  call_mine(UTF8ToString(url, lenurl));
  const response = await fetch(UTF8ToString(url, lenurl)).then(res => res.buffer())
    .then(json => json.toString());;
  out("got the fetch response");
  const lengthBytes = lengthBytesUTF8(response)+1;
  const stringOnWasmHeap = _malloc(lengthBytes);
  stringToUTF8(response, stringOnWasmHeap, lengthBytes);
  return stringOnWasmHeap;
});

EM_ASYNC_JS(char*, do_fetch2, (const char *url, int lenurl), {
  out("waiting for a fetch");
  call_mine(UTF8ToString(url, lenurl));
  const response = await fetch(UTF8ToString(url, lenurl)).then(res => res.buffer())
    .then(json => json.toString());;
  out("got the fetch response");
  const lengthBytes = lengthBytesUTF8(response)+1;
  const stringOnWasmHeap = _malloc(lengthBytes);
  stringToUTF8(response, stringOnWasmHeap, lengthBytes);
  return stringOnWasmHeap;
});

EM_ASYNC_JS(bool, sleeps, (const char *url, int lenurl), {
 const promise = new Promise((reslv, rej) => {
   setTimeout(() => reslv('ok'), 25000);
 });
 const wakedupMsg = await promise;
  return true;
});


class BaseClass {
public:
  BaseClass() {}
  std::string context;

  void basePrint() {
    printf("base print\n");
  }

  void setContext(std::string context) {
    this->context = context;
  }

  std::string callback() {
    // std::string url = "http://api.plos.org/search?q=title:DNA";
    // const int isSleep = sleeps(url.c_str(), url.length());
    std::string res = "Hellow wafuz";
    return res;
  }

std::string& callback2() {
    std::string url = "http://api.plos.org/search?q=title:DNA";
    const char *s = do_fetch(url.c_str(), url.length());    
    std::string str(s);
    printf("do_fetch_response 2 %d \n ", str.length());
    // printf("do_fetch_response 2 %s ", s);
    return str;
  }

  virtual void subPrint() = 0;
};


class SubClass : public BaseClass {
public:
  SubClass() : BaseClass() {}

  std::string context = this->context;

  void subPrint() {
    printf("sub print x\n ");
  }
};

// Binding code
EMSCRIPTEN_BINDINGS() {
  class_<BaseClass>("BaseClass")
    .function("basePrint", &BaseClass::basePrint);
  class_<SubClass, base<BaseClass>>("SubClass")
    .constructor()
    .function("subPrint", &SubClass::subPrint)
    .function("getCallback", &BaseClass::callback)
    .function("setContext", &BaseClass::setContext)
    ;
}
