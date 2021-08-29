#include <iostream>
#include <fstream>

int main()
{

    std::string myText;

    // Read from the text file
    std::ifstream MyReadFile("readme.txt");

    // Use a while loop together with the getline() function to read the file line by line
    while (std::getline(MyReadFile, myText))
    {
        // Output the text from the file
        std::cout << myText;
    }

    // Close the file
    MyReadFile.close();
    printf("add.cpp\n");
    return 123;
}
// em++  add.c -o add.wasm -s WASM=1