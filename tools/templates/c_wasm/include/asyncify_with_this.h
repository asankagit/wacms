#ifndef FETCH_H   // To make sure you don't declare the function more than once by including the header multiple times.
#define FETCH_H
#include <iostream>
#include <stdio.h>
#include <string>

using namespace std;

string add_another_file();
string do_fetch(string url, string method);
#endif