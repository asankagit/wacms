#include <thread>
#include <iostream>
#include <stdio.h>

void func()
{
    std::cout << "I'm a thread!\n";
}

int main()
{
    std::thread test1(func);
    std::thread test2(func);
    std::thread test3(func);

    // join seems to lock up the browser
    //test1.join();
    //test2.join();
    //test3.join();
}
