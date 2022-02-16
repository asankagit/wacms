#include <future>
#include <emscripten/bind.h>
#include <emscripten.h>

using namespace emscripten;

EM_ASYNC_JS(char*, wafuz_fetch, (const char *url, int lenurl), {
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

class Wafuz
{
public:
    Wafuz() {}
    std::string context;

    static std::string fetch(std::string url)
    {
        // std::string url = "http://api.plos.org/search?q=title:DNA";
        const char *s = wafuz_fetch(url.c_str(), url.length());    
        std::string str(s); 
        printf("base print\n");
        return str;
        
    }

};
