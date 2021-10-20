BUILD_TOOL=em++

all: builder_task webpack_build

installer:
	@$(INSTALLER) target add wasm32-wasi --toolchain nightly
	@echo "$(TARGET_BUILD) added"

builder_task:
	@$(BUILD_TOOL) --bind src/main.cpp -o student.js  -I .

webpack_build:
	npx webpack --config webpack.config.js
