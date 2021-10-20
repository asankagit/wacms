#include <emscripten/bind.h>
#include <emscripten.h>
#include <stdio.h>

using namespace emscripten;

EM_ASYNC_JS(std::string, do_fetch, (int num), {
  out("waiting for a fetch");
  Module.timer = false;
  call_mine(num);
  const response = await fetch("http://api.plos.org/search?q=title:DNA").then(res => res.buffer())
    .then(json => json.toString());;

  out(response);
  out("got the fetch response");
  Module.timer = true;
  // (normally you would do something with the fetch here)
  return response;
});

EM_JS(void, start_timer, (), {
  Module.timer = false;

  // setTimeout(function() {
  //   Module.timer = true;
  // }, 500);
  fetch("http://api.plos.org/search?q=title:DNA").then(res => res.buffer())
    .then(json => { 
      Module.my_fetch_res = json.toString();
      Module.timer = true;
      return json.toString()
    })
    .catch(e => out(e));
});

EM_JS(bool, check_timer, (), {
  return Module.timer;
});

EM_JS(std::string, get_result, (), {
  // out(Module.my_fetch_res);
  return "JSON.stringify(Module.my_fetch_res)";
});




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
    
    start_timer();  
    while (1) {
      if (check_timer()) {
       
        //do_fetch(12);
        printf("timer happened!\n");
        break;
        // return 0;
      }
      printf("sleeping...\n");
      emscripten_sleep(100);
      
    }
     printf("outside..\n");
    std::string str =  "emt" + get_result();
    std::string res = "{}";
    return this->context;
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
    .function("getName", &BaseClass::callback)
    .function("setName", &BaseClass::getContext)
    ;
}


// em++ MyClass.cpp   --no-entry --bind -o myclass.js
// em++ MyClass.cpp   --no-entry --bind -o myclass.js -s EXPORT_ALL=1
// this is working and try to use classes


// https://github.com/emscripten-core/emscripten/issues/2074


// https://stackoverflow.com/questions/36371178/embind-pass-lambda-function-as-callback-parameter

// bug; https://www.mail-archive.com/emscripten-discuss@googlegroups.com/msg08964.html