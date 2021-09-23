// similar to MyClass, in this we are testing header file usage
#include <student.h>
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





// https://stackoverflow.com/questions/2298242/callback-functions-in-c
// typedef int (ClassName::*CallbackType)(float);

// void DoWorkObject(CallbackType callback)
// {
//   //Class instance to invoke it through
//   ClassName objectInstance;

//   //Invocation
//   int result = (objectInstance.*callback)(1.0f);
// }

// int main(int argc, char ** argv)
// {
//   //Pass in SomeCallback to the DoWork
//   DoWorkObject(&ClassName::Method);
// }
  EMSCRIPTEN_BINDINGS(Student_example)
  {
      class_<Student>("Student").
      constructor().
      function("setName", &Student::setName).
      function("getName", &Student::getName);
  }


// em++ --bind student.cpp CombineClass.cpp -o student.js  -I .
// 