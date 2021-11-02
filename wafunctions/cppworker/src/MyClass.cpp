#include <emscripten/bind.h>
#include <emscripten.h>
#include <stdio.h>
#include <future>

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
// EM_JS(void, start_timer, (), {
// //   Module.timer = false;

// //   // setTimeout(function() {
// //   //   Module.timer = true;
// //   // }, 500);
// //   fetch("http://api.plos.org/search?q=title:DNA").then(res => res.buffer())
// //     .then(json => { 
//       // Module.my_fetch_res = "ssssssssssssssssss";
//     //   Module.timer = true;
//     //   return json.toString()
//     // })
//     // .catch(e => out(e));
// });

// EM_JS(bool, check_timer, (), {
//   return Module.timer;
// });

// EM_JS(std::string, get_result, (), {
//   // out(Module.my_fetch_res);
//   return "JSON.stringify(Module.my_fetch_res)";
// });




class BaseClass {
public:
  BaseClass() {}
  std::string context;

  void basePrint() {
    printf("base print\n");
  }

  void getContext(std::string context) {
    this->context = context;
  }

  std::string& callback() {
    std::string url = "http://api.plos.org/search?q=title:DNA";
    const char *s = do_fetch(url.c_str(), url.length());    
    std::string str(s);
    printf("do_fetch_response %d \n ", str.length());
    printf("do_fetch_response %s ", this->context.c_str());
    callback2();
    return str;
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

// EM_JS(void, logger_num, (int number), {
//   console.log({ number});
// })

// https://stackoverflow.com/questions/59532379/how-to-call-javascript-method-from-c-with-parameters-using-em-js
// https://emscripten.org/docs/api_reference/emscripten.h.html
// EM_JS(char*, call_js_agrs, (const char *title, int lentitle, const char *msg, int lenmsg), {
//     const stringFromJsWorld = jsMethodAgrs(UTF8ToString(title, lentitle), UTF8ToString(msg, lenmsg));
//     console.log({ stringFromJsWorld });
//     var lengthBytes = lengthBytesUTF8(stringFromJsWorld)+1;
//     var stringOnWasmHeap = _malloc(lengthBytes);
//     stringToUTF8(stringFromJsWorld, stringOnWasmHeap, lengthBytes);

//     // Asyncify.handleAsync(async() => {
//       // return await Promise((resolve, reject) => {
//       //   setTimout(() => resolve(stringOnWasmHeap), 2000)
//       // })
//     // })
//     return stringOnWasmHeap;
// });

// bool callJsBackWithAgrs()
// {
//     const std::string title = "Hello from C++";
//     const std::string msg = "This string is passed as a paramter from C++ code!";
//     char* js_return = call_js_agrs(title.c_str(), title.length(), msg.c_str(), msg.length());
//     printf("print_js_return %s >>", js_return);

//     delete js_return;
//     return true;


    
// }

// bool customFetch() {
//   std::string url = "http://api.plos.org/search?q=title:DNA";
//   printf("do_fetch_response%s", do_fetch(url.c_str(), url.length()));
//   return true;
// }

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
    .function("getName", &BaseClass::callback)
    .function("setName", &BaseClass::getContext)
    ;
  // emscripten::function("callJsBackWithAgrs", &callJsBackWithAgrs);
  // emscripten::function("customFetch", &customFetch);
}


// em++ MyClass.cpp   --no-entry --bind -o myclass.js
// em++ MyClass.cpp   --no-entry --bind -o myclass.js -s EXPORT_ALL=1
// this is working and try to use classes


// https://github.com/emscripten-core/emscripten/issues/2074


// https://stackoverflow.com/questions/36371178/embind-pass-lambda-function-as-callback-parameter

// bug; https://www.mail-archive.com/emscripten-discuss@googlegroups.com/msg08964.html