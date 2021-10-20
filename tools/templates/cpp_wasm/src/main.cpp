// #include <student.h>
#include "emscripten/bind.h"

using namespace emscripten;


  Student::Student() {
  }

  void Student::setName(std::string name) {
    this->name = name;
  }

  const std::string& Student::getName() {
    for(int i=0; i<10000; i++) {
      printf("%d",i);
    }
    std::string str = "response'data hi "+this->name+ "--";
    return str;
  }


  EMSCRIPTEN_BINDINGS(Student_example)
  {
      class_<Student>("Student").
      constructor().
      function("setName", &Student::setName).
      function("getName", &Student::getName);
  }
