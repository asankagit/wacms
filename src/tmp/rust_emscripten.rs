extern {
    fn appendStringToBody(s: &str);
}


fn main() {
    // println!("Hello, world!");
    unsafe {
        appendStringToBody("https://httpbin.org/image/jpeg");
    }
}
// https://kripken.github.io/blog/binaryen/2018/04/18/rust-emscripten.html
// # setup - only needed once
// rustup default nightly
// rustup target add wasm32-unknown-emscripten
// # compile the file
// rustc --target=wasm32-unknown-emscripten hello.rs -o hello.js -C opt-level=s


// target=wasm32-unknown-emscripten fails use wasm32-unknown-unknown