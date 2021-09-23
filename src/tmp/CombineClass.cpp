// try to combine with Student.h to abstract emscripten embind tags
#include<student.h>
#include<string>
#include "emscripten/bind.h"

using namespace emscripten;

std::string lerp() {
    Student student;
    std::string req = student.getName();
    return  student.getName();
}

EMSCRIPTEN_BINDINGS(my_module) {
    function("lerp", &lerp);
}
