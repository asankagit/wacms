use std::{env, fs};

fn process(current_dir: &str) -> Result<(), String> {
    for entry in fs::read_dir(current_dir).map_err(|err| format!("{}", err))? {
        let entry = entry.map_err(|err| format!("{}", err))?;
        let path = entry.path();
        let metadata = fs::metadata(&path).map_err(|err| format!("{}", err))?;
        println!(
            "filename: {:?}, filesize: {:?} bytes",
             path.file_name().ok_or("No filename").map_err(|err| format!("{}",     err))?,
         metadata.len()
         );
     }
 Ok(())
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let program = args[0].clone();
    if args.len() < 2 {
        eprintln!("{} <input_folder>", program);
        return;
     }
    if let Err(err) = process(&args[1]) {
        eprintln!("{}", err)
    }
}


// https://sendilkumarn.com/blog/wasi-with-wasmtime/
// rustup target add wasm32-wasi --toolchain nightly
// cargo +nightly build --target wasm32-wasi


// run output
// wasmer target/wasm32-wasi/debug/sizer.wasm  --dir=/home/asanka/Documents/learn/rust-webassembly/wasi/sizer /home/asanka/Documents/learn/rust-webassembly/wasi/sizer