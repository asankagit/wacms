BUILD_TOOL=em++

all: builder_task webpack_build

installer:
	@$(INSTALLER) target add wasm32-wasi --toolchain nightly
	@echo "$(TARGET_BUILD) added"

builder_task:
	# @$(BUILD_TOOL) src/main.cpp --bind  -s ASYNCIFY -o student.js -Iinclide -I . 
	# g++ -c -o Wafuz.o include/Wafuz.cpp
	@$(BUILD_TOOL) --bind src/*.cpp -Iinclude -s ASYNCIFY -o emscripten_mini.js -std=c++11  
	# Avoid errors for undefined variables  -s ERROR_ON_UNDEFINED_SYMBOLS=0
	# Optimzed with -O3
	# @$(BUILD_TOOL) src/main.cpp --bind -s ASYNCIFY -o dist/student_optimized.wasm -s WASM=1 -Iinclide -I . --no-entry
	# @$(BUILD_TOOL) --bind src/MyClass.cpp -s ASYNCIFY -o dist/myclass_optimized.wasm -s WASM=1 --no-entry -o dist/support.js

webpack_build:
	npx webpack --config webpack.config.js
