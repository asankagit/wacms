INSTALLER=rustup
BUILD_TOOL=cargo
TARGET_BUILD=wasm32-wasi

all: builder_task webpack_build

installer:
	@$(INSTALLER) target add wasm32-wasi --toolchain nightly
	@echo "$(TARGET_BUILD) added"

builder_task:
	@$(BUILD_TOOL) +nightly build --target $(TARGET_BUILD)
webpack_build:
	npx webpack --config webpack.config.js
