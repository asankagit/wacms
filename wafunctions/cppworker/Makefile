BUILD_TOOL=em++

all: builder_task webpack_build

installer:
	@$(INSTALLER) target add wasm32-wasi --toolchain nightly
	@echo "$(TARGET_BUILD) added"

builder_task:
	@$(BUILD_TOOL) src/main.cpp --bind  -s ASYNCIFY -o student.js -Iinclide -I . 
	@$(BUILD_TOOL) --bind src/MyClass.cpp  -s ASYNCIFY -o myclass.js
	# Optimzed with -O3
	@$(BUILD_TOOL) src/main.cpp --bind -s ASYNCIFY -o dist/student_optimized.wasm -s WASM=1 -Iinclide -I . --no-entry
	@$(BUILD_TOOL) --bind src/MyClass.cpp -s ASYNCIFY -o dist/myclass_optimized.wasm -s WASM=1 --no-entry -o dist/support.js

webpack_build:
	npx webpack --config webpack.config.js
