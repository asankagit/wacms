# wacms
WebAssembly Code Management System

# Porting c/c++ to Js using Emscripten complier
`em++ <filename> -Os -s WASM=1 -s SIDE_MODULE=1 -o <output_name>.wasm`

# setup - only needed once
`rustup default nightly`
`rustup target add wasm32-unknown-emscripten`
# compile the file (Porting rust to Js using LLVM WASM fronend)

`target=wasm32-unknown-emscripten fails use wasm32-unknown-unknown`

# Run with WASI
`node --experimental-wasi-unstable-preview1 wasiRunner.js `
