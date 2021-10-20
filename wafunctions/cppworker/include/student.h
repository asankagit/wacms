// related with student.cpp
#include <string>

#ifndef __STUDENT__H
#define __STUDENT__H

  class Student {
    std::string name;
  public:
    Student();
    void setName(std::string name);
    const std::string& getName();
  };

#endif